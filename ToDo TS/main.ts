class listItem {
  nummer: number;
  content: string;
  isChecked: boolean;
  constructor(nummer: number, content: string, isChecked: boolean) {
    this.nummer = nummer;
    this.content = content;
    this.isChecked = isChecked;
  }
}

class saveListClass {
  itemArray: listItem[];
  nonCheckedArray: listItem[];
  checkedArray: listItem[];
  nummer: number;
  constructor(
    itemArray: listItem[],
    nonCheckedArray: listItem[],
    checkedArray: listItem[],
    nummer: number
  ) {
    this.itemArray = itemArray;
    this.nonCheckedArray = nonCheckedArray;
    this.checkedArray = checkedArray;
    this.nummer = nummer;
  }
}

enum flik {
  all,
  nonChecked,
  checked,
}

//****Get selectors***********************************/
const submitBtn = document.querySelector("#main-submit-button");
const saveSubmitBtn = document.querySelector("#save-submit-button");
const saveSvg = document.querySelector("#save");
const mainBox = document.querySelector(".main-box");
const ulList = document.querySelector(".ul-list");
const inputText = <HTMLInputElement>document.querySelector("#input-box");
const saveInputText = <HTMLInputElement>(
  document.querySelector("#save-input-box")
);
const clearBtn = document.querySelector("#clear-bottom");
const clearListBtn = document.querySelector("#clear-list");
const actionBar = <HTMLInputElement>document.querySelector(".action-bar");
const actionBarSpan = <HTMLInputElement>(
  document.querySelector(".action-bar-span")
);
//****Variables*****************************************/
var number = 0;
var ItemArray: listItem[] = [];
var checkedArray: listItem[] = [];
var nonCheckedArray: listItem[] = [];
var currentFlik = flik.all;
var savedListObject: { [listName: string]: saveListClass } = {};
var currentList = "";
//****Listeners****************************************/
submitBtn!.addEventListener("click", addItem);
saveSubmitBtn!.addEventListener("click", saveListbtn);
clearListBtn!.addEventListener("click", removeList);
saveSvg!.addEventListener("click", getSaveRow);
clearBtn!.addEventListener("click", clear);
// Execute a function when the user releases a key on the keyboard
inputText!.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    addItem();
  }
});
saveInputText!.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    saveListbtn();
  }
});

//****Functions****************************************/
window.onload = function () {
  if (localStorage.getItem("currentList") !== null) {
    currentList = localStorage.getItem("currentList") || "";
  }
  let tmpArray = localStorage.getItem("itemArray");
  if (tmpArray != null) {
    ItemArray = JSON.parse(tmpArray);
  }
  tmpArray = localStorage.getItem("checkedArray");
  if (tmpArray != null) {
    checkedArray = JSON.parse(tmpArray);
  }
  tmpArray = localStorage.getItem("nonCheckedArray");
  if (tmpArray != null) {
    nonCheckedArray = JSON.parse(tmpArray);
  }

  if (localStorage.getItem("savedListsObject") !== null) {
    savedListObject = JSON.parse(
      localStorage.getItem("savedListsObject") || ""
    );
  }

  let savedLists = <HTMLInputElement>document.querySelector("#savedLists");
  for (const key in savedListObject) {
    savedLists.innerHTML += `<option value="${key}">${key}</option>`;
  }

  let tmpNumber = localStorage.getItem("number");
  if (tmpNumber != null) {
    number = parseInt(tmpNumber);
  }
  tmpNumber = localStorage.getItem("flik");
  if (tmpNumber != null) {
    currentFlik = parseInt(tmpNumber);
  }
  if (currentList !== "") {
    ItemArray = savedListObject[currentList].itemArray;
    checkedArray = savedListObject[currentList].checkedArray;
    nonCheckedArray = savedListObject[currentList].nonCheckedArray;
    number = savedListObject[currentList].nummer;
    const div = <HTMLInputElement>document.querySelector(".current-list-box");
    div.style.height = "2rem";
    div.style.padding = "1rem";
    const span = <HTMLInputElement>document.querySelector(".current-span");
    span.style.height = "2rem";
    span.style.padding = "1rem";

    span.innerHTML = currentList;
  }
  console.log("current list when loading window is : " + currentList);
  if (currentFlik === flik.checked) {
    const checked = <HTMLInputElement>document.querySelector("#checked-items");
    flikFunction(checked, currentFlik);
  } else if (currentFlik === flik.nonChecked) {
    const checked = <HTMLInputElement>(
      document.querySelector("#non-checked-items")
    );
    flikFunction(checked, currentFlik);
  } else if (currentFlik === flik.all) {
    const checked = <HTMLInputElement>document.querySelector("#all");
    flikFunction(checked, currentFlik);
  }
};

function addItem(): void {
  console.log("add item");
  let item = inputText.value;
  nonCheckedArray = [];
  checkedArray = [];
  if (item !== "") {
    if (currentFlik === flik.checked) {
      ItemArray.unshift(new listItem(number, item, true));
    } else {
      ItemArray.unshift(new listItem(number, item, false));
    }
    number++;
    for (let index = 0; index < ItemArray.length; index++) {
      if (ItemArray[index].isChecked === false) {
        nonCheckedArray.push(ItemArray[index]);
      } else {
        checkedArray.push(ItemArray[index]);
      }
    }
    saveList();
    flikUpdateList();
    inputText.value = "";
    inputText.placeholder = "";
    inputText.focus();
    actionBarFunction("You've added an item", "rgb(33, 129, 167)", "white");
  } else {
    inputText.focus();
  }
  console.log("savedobjectlist is :");
  console.log(savedListObject);
}
function clear() {
  ulList!.innerHTML = "";
  number = 0;
  ItemArray = [];
  checkedArray = [];
  nonCheckedArray = [];
  console.log(savedListObject);
  //savedListObject = {};
  console.log(savedListObject);
  //currentList = ""; //ta bort sen
  saveList();
  actionBarFunction("You've cleared the list", "darkred", "white");
}

function upArrowFunction(itemNumber: number): void {
  if (currentFlik === flik.checked) {
    const indexCheckedArray = checkedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    if (indexCheckedArray !== 0) {
      const IndexCheckedOther = indexCheckedArray - 1;

      const ItemArrayIndex = ItemArray.findIndex((object) => {
        return object.nummer === checkedArray[indexCheckedArray].nummer;
      });

      const ItemArrayOtherindex = ItemArray.findIndex((object) => {
        return object.nummer === checkedArray[IndexCheckedOther].nummer;
      });

      ItemArray[ItemArrayIndex] = checkedArray[IndexCheckedOther];
      ItemArray[ItemArrayOtherindex] = checkedArray[indexCheckedArray];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      saveList();
      actionBarFunction("You've moved an item up", "#00008B", "white");
    }
  } else if (currentFlik === flik.nonChecked) {
    const indexCheckedArray = nonCheckedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    if (indexCheckedArray !== 0) {
      const IndexCheckedOther = indexCheckedArray - 1;

      const ItemArrayIndex = ItemArray.findIndex((object) => {
        return object.nummer === nonCheckedArray[indexCheckedArray].nummer;
      });

      const ItemArrayOtherindex = ItemArray.findIndex((object) => {
        return object.nummer === nonCheckedArray[IndexCheckedOther].nummer;
      });

      ItemArray[ItemArrayIndex] = nonCheckedArray[IndexCheckedOther];
      ItemArray[ItemArrayOtherindex] = nonCheckedArray[indexCheckedArray];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      saveList();
      actionBarFunction("You've moved an item up", "#00008B", "white");
    }
  } else {
    const index = ItemArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });

    if (index !== 0) {
      let tmpArray = [...ItemArray];
      ItemArray[index - 1] = tmpArray[index];
      ItemArray[index] = tmpArray[index - 1];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      tickbefore(ItemArray);
      saveList();
      actionBarFunction("You've moved an item up", "#00008B", "white");
    }
  }
}

function downArrowFunction(itemNumber: number): void {
  if (currentFlik === flik.checked) {
    const indexCheckedArray = checkedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    if (indexCheckedArray !== checkedArray.length - 1) {
      const IndexCheckedOther = indexCheckedArray + 1;

      const ItemArrayIndex = ItemArray.findIndex((object) => {
        return object.nummer === checkedArray[indexCheckedArray].nummer;
      });

      const ItemArrayOtherindex = ItemArray.findIndex((object) => {
        return object.nummer === checkedArray[IndexCheckedOther].nummer;
      });

      ItemArray[ItemArrayIndex] = checkedArray[IndexCheckedOther];
      ItemArray[ItemArrayOtherindex] = checkedArray[indexCheckedArray];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      saveList();
      actionBarFunction("You've moved an item down", "#00008B", "white");
    }
  } else if (currentFlik === flik.nonChecked) {
    const indexCheckedArray = nonCheckedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    if (indexCheckedArray !== nonCheckedArray.length - 1) {
      const IndexCheckedOther = indexCheckedArray + 1;

      const ItemArrayIndex = ItemArray.findIndex((object) => {
        return object.nummer === nonCheckedArray[indexCheckedArray].nummer;
      });

      const ItemArrayOtherindex = ItemArray.findIndex((object) => {
        return object.nummer === nonCheckedArray[IndexCheckedOther].nummer;
      });

      ItemArray[ItemArrayIndex] = nonCheckedArray[IndexCheckedOther];
      ItemArray[ItemArrayOtherindex] = nonCheckedArray[indexCheckedArray];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      saveList();
      actionBarFunction("You've moved an item down", "#00008B", "white");
    }
  } else {
    const index = ItemArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });

    if (index !== ItemArray.length - 1) {
      let tmpArray = [...ItemArray];
      ItemArray[index + 1] = tmpArray[index];
      ItemArray[index] = tmpArray[index + 1];

      checkedArray = [];
      nonCheckedArray = [];
      for (let index = 0; index < ItemArray.length; index++) {
        if (ItemArray[index].isChecked === false) {
          nonCheckedArray.push(ItemArray[index]);
        } else checkedArray.push(ItemArray[index]);
      }
      flikUpdateList();
      tickbefore(ItemArray);
      saveList();
      actionBarFunction("You've moved an item down", "#00008B", "white");
    }
  }
}

function deleteItem(itemNumber: number) {
  const index = ItemArray.findIndex((object) => {
    return object.nummer === itemNumber;
  });
  if (ItemArray[index].isChecked === true) {
    const index1 = checkedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    checkedArray.splice(index1, 1);
  } else {
    const index1 = nonCheckedArray.findIndex((object) => {
      return object.nummer === itemNumber;
    });
    nonCheckedArray.splice(index1, 1);
  }
  ItemArray.splice(index, 1);
  flikUpdateList();
  saveList();
  actionBarFunction("You've removed an item", "#ff3232", "white");
}

function tick(siffra: number) {
  const index = ItemArray.findIndex((object) => {
    return object.nummer === siffra;
  });
  let spannTick = <HTMLStyleElement>(
    document.querySelector(`.span-list${siffra}`)
  );
  let spannCheck = document.getElementById(`check${siffra}`);

  if (ItemArray[index].isChecked === false) {
    spannTick!.style.textDecoration = "line-through";
    spannCheck!.style.fill = "#00d205";
    ItemArray[index].isChecked = true;
  } else if (ItemArray[index].isChecked === true) {
    spannTick!.style.textDecoration = "none";
    spannCheck!.style.fill = "white";
    ItemArray[index].isChecked = false;
  }
  checkedArray = [];
  nonCheckedArray = [];
  for (let index = 0; index < ItemArray.length; index++) {
    if (ItemArray[index].isChecked === false) {
      nonCheckedArray.push(ItemArray[index]);
    } else checkedArray.push(ItemArray[index]);
  }

  saveList();
  flikUpdateList();
  actionBarFunction("You've checked off an item", "#8cff9e");
  console.log("in tick function: ");
  console.log(savedListObject);
}

function tickbefore(tickArray: listItem[]) {
  for (let index = 0; index < tickArray.length; index++) {
    let spannTick = <HTMLStyleElement>(
      document.querySelector(`.span-list${tickArray[index].nummer}`)
    );
    let spannCheck = document.getElementById(`check${tickArray[index].nummer}`);
    if (tickArray[index].isChecked === false) {
      spannTick!.style.textDecoration = "none";
      spannCheck!.style.fill = "white";
    } else if (tickArray[index].isChecked === true) {
      spannTick!.style.textDecoration = "line-through";
      spannCheck!.style.fill = "#00d205";
    }
  }
}

function createTodoList(ItemArray: listItem[]): void {
  ulList!.innerHTML = "";
  for (let index = 0; index < ItemArray.length; index++) {
    ulList!.innerHTML += `<li class="li-list" id="li-list${ItemArray[index].nummer}" onmouseover="listHover(this, ${ItemArray[index].nummer})" onmouseout="listOut(this, ${ItemArray[index].nummer})">
              <span class="span-list${ItemArray[index].nummer}" style="max-width: 25rem;  word-wrap:break-word"> ${ItemArray[index].content} </span>
              <svg
                onclick="tick(${ItemArray[index].nummer})"  
                class="tick"
                viewBox="0 0 512 512"
               
              >
                <g></g>
                <path class="check" id ="check${ItemArray[index].nummer}" d="M97.29 294.615l95.969 110.756 289.086-227.379-35.113-44.636-267.807 210.616 39.014 3.738-78.244-90.276z" />
  <path  id="box" d="M 376.682 156.323 L 377.028 430.93 L 395.806 411.996 L 48.433 411.996 L 67.242 430.93 L 67.242 81.06 L 48.433 99.994 L 395.806 99.994 L 377.028 81.06 L 377.028 157.625 L 414.615 123.956 L 414.615 62.127 L 29.666 62.127 L 29.666 449.885 L 414.615 449.885 L 414.615 120.673 L 376.682 156.323 Z"  style=""/>
  

                />
              </svg>
              <svg
              onclick="deleteItem(${ItemArray[index].nummer})"
                class="trash"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                enable-background="new 0 0 512 512"
                xml:space="preserve"
              >
                <path
                  fill="#1D1D1B"
                  d="M459.232,60.687h-71.955c-1.121-17.642-15.631-31.657-33.553-31.657H161.669
	c-17.921,0-32.441,14.015-33.553,31.657H64.579c-18.647,0-33.767,15.12-33.767,33.768v8.442c0,18.648,15.12,33.768,33.767,33.768
	h21.04v342.113c0,13.784,11.179,24.963,24.963,24.963h308.996c13.784,0,24.964-11.179,24.964-24.963V136.665h14.691
	c18.663,0,33.768-15.12,33.768-33.768v-8.442C493,75.807,477.896,60.687,459.232,60.687z M196.674,443.725
	c0,12.58-10.197,22.803-22.802,22.803c-12.598,0-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.205-22.802,22.803-22.802
	c12.605,0,22.802,10.206,22.802,22.802V443.725z M287.887,443.725c0,12.58-10.205,22.803-22.803,22.803
	s-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.205-22.802,22.803-22.802s22.803,10.206,22.803,22.802V443.725z M379.099,443.725
	c0,12.58-10.205,22.803-22.803,22.803c-12.613,0-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.189-22.802,22.803-22.802
	c12.598,0,22.803,10.206,22.803,22.802V443.725z"
                />
              </svg>
              
<svg version="1.1" class="pen" onclick ="penFunction(${ItemArray[index].nummer})" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
<path d="M493.278,154.515l-22.625,22.641L334.871,41.39l22.625-22.641c25-25,65.531-25,90.531,0l45.25,45.266
	C518.246,89,518.246,129.515,493.278,154.515z M176.465,426.031c-6.25,6.25-6.25,16.375,0,22.625c6.25,6.281,16.375,6.281,22.625,0
	l248.938-248.875l-22.656-22.641L176.465,426.031z M63.309,312.906c-6.25,6.25-6.25,16.375,0,22.625s16.375,6.25,22.625,0
	L334.871,86.64l-22.625-22.625L63.309,312.906z M357.465,109.25L108.559,358.156c-12.5,12.469-12.469,32.75,0,45.25
	c12.5,12.5,32.75,12.563,45.281-0.031l248.906-248.859L357.465,109.25z M153.778,471.219c-7.656-7.656-11.344-17.375-12.719-27.375
	c-3.25,0.5-6.531,0.969-9.875,0.969c-17.094,0-33.156-6.688-45.25-18.781c-12.094-12.125-18.75-28.156-18.75-45.25
	c0-3.125,0.469-6.156,0.906-9.188c-10.344-1.406-19.906-5.938-27.406-13.438c-0.719-0.719-0.969-1.688-1.625-2.469L-0.004,512
	l155.906-39.031C155.215,472.344,154.434,471.875,153.778,471.219z"/>
</svg>

              <svg class= "up-arrow"
              onclick="upArrowFunction(${ItemArray[index].nummer})"
               id="Capa_1"  x="0px" y="0px"
              viewBox="0 0 26.775 26.775" style="enable-background:new 0 0 26.775 26.775;"
              xml:space="preserve">

	<path style="fill:#030104;" d="M13.915,0.379l8.258,9.98c0,0,1.252,1.184-0.106,1.184c-1.363,0-4.653,0-4.653,0s0,0.801,0,2.025
		c0,3.514,0,9.9,0,12.498c0,0,0.184,0.709-0.885,0.709c-1.072,0-5.783,0-6.55,0c-0.765,0-0.749-0.592-0.749-0.592
		c0-2.531,0-9.133,0-12.527c0-1.102,0-1.816,0-1.816s-2.637,0-4.297,0c-1.654,0-0.408-1.24-0.408-1.24s7.025-9.325,8.001-10.305
		C13.24-0.414,13.915,0.379,13.915,0.379z"/> </svg> 

    <svg class= "down-arrow" onclick="downArrowFunction(${ItemArray[index].nummer})" id="Capa_1" x="0px" y="0px"
	 viewBox="0 0 26.775 26.775" style="enable-background:new 0 0 26.775 26.775;" xml:space="preserve">
   
	<path style="fill:#030104;" d="M13.915,0.379l8.258,9.98c0,0,1.252,1.184-0.106,1.184c-1.363,0-4.653,0-4.653,0s0,0.801,0,2.025
		c0,3.514,0,9.9,0,12.498c0,0,0.184,0.709-0.885,0.709c-1.072,0-5.783,0-6.55,0c-0.765,0-0.749-0.592-0.749-0.592
		c0-2.531,0-9.133,0-12.527c0-1.102,0-1.816,0-1.816s-2.637,0-4.297,0c-1.654,0-0.408-1.24-0.408-1.24s7.025-9.325,8.001-10.305
		C13.24-0.414,13.915,0.379,13.915,0.379z"/> </svg>`;
  }
}

function saveList(): void {
  localStorage.setItem("itemArray", JSON.stringify(ItemArray));
  localStorage.setItem("checkedArray", JSON.stringify(checkedArray));
  localStorage.setItem("nonCheckedArray", JSON.stringify(nonCheckedArray));
  localStorage.setItem("number", "" + number);

  if (currentList !== "") {
    savedListObject[currentList].itemArray = JSON.parse(
      JSON.stringify(ItemArray)
    );
    savedListObject[currentList].checkedArray = JSON.parse(
      JSON.stringify(checkedArray)
    );
    savedListObject[currentList].nonCheckedArray = JSON.parse(
      JSON.stringify(nonCheckedArray)
    );

    savedListObject[currentList].nummer = number;
  }
  localStorage.setItem("currentList", currentList);

  localStorage.setItem(
    "savedListsObject",
    "" + JSON.stringify(savedListObject)
  );
}

function listHover(listItem: HTMLElement, siffra: number) {
  let Check = document.getElementById(`check${siffra}`);
  listItem.style.backgroundColor = "#c6e6f5";
  const index = ItemArray.findIndex((object) => {
    return object.nummer === siffra;
  });
  if (ItemArray[index].isChecked === false) {
    Check!.style.fill = "#c6e6f5";
  }
}

function listOut(listItem: HTMLElement, siffra: number) {
  let Check = document.getElementById(`check${siffra}`);
  const index = ItemArray.findIndex((object) => {
    return object.nummer === siffra;
  });
  listItem.style.backgroundColor = "white";
  if (ItemArray[index].isChecked === false) {
    Check!.style.fill = "white";
  }
}

function flikFunction(html: HTMLElement, flikChoice: number) {
  const all = <HTMLInputElement>document.querySelector("#all");
  const checked = <HTMLInputElement>document.querySelector("#checked-items");
  const nonChecked = <HTMLInputElement>(
    document.querySelector("#non-checked-items")
  );

  all.style.backgroundColor = "white";
  checked.style.backgroundColor = "white";
  nonChecked.style.backgroundColor = "white";
  all.style.color = "black";
  checked.style.color = "black";
  nonChecked.style.color = "black";

  html.style.backgroundColor = "rgb(33, 129, 167)";
  html.style.color = "white";

  if (flikChoice === flik.checked) {
    createTodoList(checkedArray);
    tickbefore(checkedArray);
    currentFlik = flik.checked;
  } else if (flikChoice === flik.nonChecked) {
    createTodoList(nonCheckedArray);
    tickbefore(nonCheckedArray);
    currentFlik = flik.nonChecked;
  } else if (flikChoice === flik.all) {
    createTodoList(ItemArray);
    tickbefore(ItemArray);
    currentFlik = flik.all;
  }
  localStorage.setItem("flik", "" + currentFlik);
  inputText.focus();
}

function flikUpdateList() {
  if (currentFlik === flik.checked) {
    const checked = <HTMLInputElement>document.querySelector("#checked-items");
    flikFunction(checked, currentFlik);
  } else if (currentFlik === flik.nonChecked) {
    const checked = <HTMLInputElement>(
      document.querySelector("#non-checked-items")
    );
    flikFunction(checked, currentFlik);
  } else if (currentFlik === flik.all) {
    const checked = <HTMLInputElement>document.querySelector("#all");
    flikFunction(checked, currentFlik);
  }
}

function actionBarFunction(
  message: string,
  backgroundColor: string,
  textColor = "black"
) {
  actionBar!.style.background = backgroundColor;
  actionBarSpan!.innerHTML = message;
  actionBarSpan!.style.color = textColor;

  setTimeout(function () {
    actionBar.style.background = "white";
    actionBarSpan.style.color = "white";
  }, 2400);
}

function penFunction(nummer: number) {
  const index = ItemArray.findIndex((object) => {
    return object.nummer === nummer;
  });
  const inputNummer = "input" + nummer;
  let liList = <HTMLInputElement>document.querySelector(`#li-list${nummer}`);
  liList.innerHTML = `<input type="text" id="${inputNummer}"  value="${ItemArray[index].content}"
  style="margin:0;" class="input-item"  />
  <button style="margin:0;" class="submit-button" id="submit-button${nummer}" onclick="Edit(${nummer})"   type="Edit">Edit</button>  
  <svg onclick="flikUpdateList()" id="back-arrow" x="0px" y="0px"
	 width="299.021px" height="299.021px" viewBox="0 0 299.021 299.021" style="enable-background:new 0 0 299.021 299.021;"
	 xml:space="preserve">
<g>
	<g>
		<path d="M292.866,254.432c-2.288,0-4.443-1.285-5.5-3.399c-0.354-0.684-28.541-52.949-146.169-54.727v51.977
			c0,2.342-1.333,4.48-3.432,5.513c-2.096,1.033-4.594,0.793-6.461-0.63L2.417,154.392C0.898,153.227,0,151.425,0,149.516
			c0-1.919,0.898-3.72,2.417-4.888l128.893-98.77c1.87-1.426,4.365-1.667,6.461-0.639c2.099,1.026,3.432,3.173,3.432,5.509v54.776
			c3.111-0.198,7.164-0.37,11.947-0.37c43.861,0,145.871,13.952,145.871,143.136c0,2.858-1.964,5.344-4.75,5.993
			C293.802,254.384,293.34,254.432,292.866,254.432z"/>
	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
`;
  const input = <HTMLInputElement>document.querySelector(`#${inputNummer}`);
  input.focus();
}

function Edit(nummer: number) {
  const inputNummer = "input" + nummer;
  const newValue = (<HTMLInputElement>document.querySelector(`#${inputNummer}`))
    .value;
  const index = ItemArray.findIndex((object) => {
    return object.nummer === nummer;
  });
  ItemArray[index].content = newValue;
  checkedArray = [];
  nonCheckedArray = [];
  for (let index = 0; index < ItemArray.length; index++) {
    if (ItemArray[index].isChecked === false) {
      nonCheckedArray.push(ItemArray[index]);
    } else checkedArray.push(ItemArray[index]);
  }
  flikUpdateList();
  saveList();
}

function getSaveRow(): void {
  const saveRow = <HTMLInputElement>document.querySelector(".save-row");
  saveRow.style.maxHeight = "10rem";
  saveRow.style.padding = "1rem";
}

function noSaveFunction(): void {
  const saveRow = <HTMLInputElement>document.querySelector(".save-row");
  saveRow.style.maxHeight = "0em";
}

function noLoadFunction(): void {
  const loadRow = <HTMLInputElement>document.querySelector(".load-row");
  loadRow.style.maxHeight = "0em";
  const btn = <HTMLInputElement>document.querySelector(".margin-div");
  btn.style.maxHeight = "0rem";
}

function loadFunction(): void {
  const loadRow = <HTMLInputElement>document.querySelector(".load-row");
  loadRow.style.maxHeight = "10rem";
  const btn = <HTMLInputElement>document.querySelector(".margin-div");
  btn.style.maxHeight = "5rem";
}

function selectFunction(value: string) {
  currentList = value;
  ItemArray = JSON.parse(
    JSON.stringify(savedListObject[currentList].itemArray)
  );
  checkedArray = JSON.parse(
    JSON.stringify(savedListObject[currentList].checkedArray)
  );

  nonCheckedArray = JSON.parse(
    JSON.stringify(savedListObject[currentList].nonCheckedArray)
  );
  number = savedListObject[currentList].nummer;
  flikUpdateList();
  saveList();

  console.log(" You've chosen this list " + currentList);
  console.log("in list selection  function: ");
  console.log(savedListObject);

  if (currentList !== "") {
    const div = <HTMLInputElement>document.querySelector(".current-list-box");
    div.style.height = "2rem";
    div.style.padding = "1rem";
    const span = <HTMLInputElement>document.querySelector(".current-span");
    span.style.height = "2rem";
    span.style.padding = "1rem";

    span.innerHTML = currentList;

    actionBarFunction("You've opened a list", "pink", "black");
  }
}

function saveListbtn(): void {
  const listName = (<HTMLInputElement>document.querySelector(`#save-input-box`))
    .value;

  savedListObject[listName] = new saveListClass(
    JSON.parse(JSON.stringify(ItemArray)),
    JSON.parse(JSON.stringify(nonCheckedArray)),
    JSON.parse(JSON.stringify(checkedArray)),
    number
  );
  console.log("savedlistObject after pressing save button:");
  console.log(savedListObject);
  let savedLists = <HTMLInputElement>document.querySelector("#savedLists");
  savedLists.innerHTML += `<option value="${listName}">${listName}</option>`;
  noSaveFunction();
  saveList();
  actionBarFunction("You've saved your list", "purple", "white");
  currentList = listName;
  console.log("Curent list after saving is " + currentList);
  if (currentList !== "") {
    const div = <HTMLInputElement>document.querySelector(".current-list-box");
    div.style.height = "2rem";
    div.style.padding = "1rem";
    const span = <HTMLInputElement>document.querySelector(".current-span");
    span.style.height = "2rem";
    span.style.padding = "1rem";

    span.innerHTML = currentList;
  }
}

function removeList() {
  delete savedListObject[currentList];
  ItemArray = [];
  checkedArray = [];
  nonCheckedArray = [];
  currentList = "";
  saveList();
  flikUpdateList();
  let savedLists = <HTMLInputElement>document.querySelector("#savedLists");
  savedLists.innerHTML = `<option value="">Choose a list to load</option>`;
  for (const key in savedListObject) {
    savedLists.innerHTML += `<option value="${key}">${key}</option>`;
  }

  const div = <HTMLInputElement>document.querySelector(".current-list-box");
  div.style.height = "0rem";
  div.style.padding = "0rem";
  const span = <HTMLInputElement>document.querySelector(".current-span");
  span.style.height = "0";
  span.style.padding = "0rem";

  span.innerHTML = currentList;
  actionBarFunction("You've removed a list", "darkred", "white");
}
