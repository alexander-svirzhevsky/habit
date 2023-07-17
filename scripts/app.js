"use strict";

let habits = [];
const HABITS_KEY = "HABITS_KEY";

const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
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

function rerender(activeHabitId) {
  console.log(activeHabitId);
  const activeHabit = habits.find((habit) => habit.id === activeHabitId);
  rerenderMenu(activeHabit);
  rerenderHeader(activeHabit);
}

console.log("here");

(() => {
  loadHabits();
  rerender(habits[0].id);
})();
