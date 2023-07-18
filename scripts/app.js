"use strict";

let habits = [];
const HABITS_KEY = "HABITS_KEY";
let globalActiveHabitId;

const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    habbitDay: document.querySelector(".habbit__day"),
  },
};

/* utils */

function loadHabits() {
  const habitsString = localStorage.getItem(HABITS_KEY);
  const habitsArray = JSON.parse(habitsString);

  if (Array.isArray(habitsArray)) {
    habits = habitsArray;
  }
}

function saveHabit() {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

/* render */
function rerenderMenu(activeHabit) {
  if (!activeHabit) {
    return null;
  }

  for (const habit of habits) {
    const existedElement = document.querySelector(
      `[menu-habit-id="${habit.id}"]`
    );

    if (!existedElement) {
      const element = document.createElement("button");
      element.classList.add("menu__item");
      element.setAttribute("menu-habit-id", habit.id);
      element.innerHTML = `<img src="./images/${habit.icon}.svg" alt="${habit.name}" />`;

      element.addEventListener("click", () => rerender(habit.id));

      if (activeHabit.id === habit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }

    if (activeHabit.id === habit.id) {
      existedElement.classList.add("menu__item_active");
    } else {
      existedElement.classList.remove("menu__item_active");
    }
  }
}

function rerenderHeader(activeHabit) {
  if (!activeHabit) {
    return null;
  }

  const percentage =
    activeHabit.days.length / activeHabit.target > 1
      ? 100
      : (activeHabit.days.length / activeHabit.target) * 100;

  page.header.h1.innerText = activeHabit.name;
  page.header.progressPercent.innerText = `${percentage.toFixed(0)} %`;
  page.header.progressCoverBar.setAttribute("style", `width: ${percentage}%`);
}

function rerenderBody(activeHabit) {
  if (!activeHabit) {
    return null;
  }

  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `<div class="habbit__day">День ${+index + 1}</div>
      <div class="habbit__comment">${activeHabit.days[index].comment}</div>
      <button onclick="onDelete(${index})" class="habbit__delete">
        <img src="./images/delete.svg" alt="Удалите день ${index + 1}" />
      </button>
    `;
    page.content.daysContainer.appendChild(element);
  }
  page.content.habbitDay.innerHTML = `День ${activeHabit.days.length + 1}`;
}

/* manipulations with days */
function onAddDay(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get("comment");

  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }

  habits = habits.map((habit) => {
    if (habit.id === globalActiveHabitId) {
      return {
        ...habit,
        days: habit.days.concat([{ comment }]),
      };
    } else {
      return habit;
    }
  });

  form["comment"].value = "";
  rerender(globalActiveHabitId);
  saveHabit();
}

function onDelete(index) {
  habits = habits.map((habit) => {
    if (habit.id === globalActiveHabitId) {
      habit.days.splice(index, 1);
      return {
        ...habit,
        days: habit.days,
      };
    }
    return habit;
  });
  rerender(globalActiveHabitId);
  saveHabit();
}

/* popup actions */
function togglePopup() {
  const popup = document.querySelector(".cover");
  popup.classList.toggle("cover_hidden");
}

/* work with icons within form */
function setIcon(context, icon) {
  document.querySelector(".popup__form input[name='icon']").value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

function onAddNewHabit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const icon = data.get("icon");
  const name = data.get("name");
  const target = data.get("target");

  habits.push({
    id: habits.length + 1,
    icon: icon,
    name: name,
    target: target,
    days: [],
  });
  togglePopup();
  saveHabit();
  rerender(globalActiveHabitId);
}

function rerender(activeHabitId) {
  globalActiveHabitId = activeHabitId;
  const activeHabit = habits.find((habit) => habit.id === activeHabitId);
  rerenderMenu(activeHabit);
  rerenderHeader(activeHabit);
  rerenderBody(activeHabit);
}

(() => {
  loadHabits();
  rerender(habits[0].id);
})();
