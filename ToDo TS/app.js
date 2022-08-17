"use strict";
var person = {
    punkt: [1, true, "städa"],
};
document.body.innerHTML = person.punkt[0] + "";
for (var i = 1; i < 10; i++) {
    person.punkt[0] = i;
    console.log(JSON.parse(JSON.stringify(person)));
    console.log(person.punkt);
}
