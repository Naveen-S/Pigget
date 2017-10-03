// Budget controller module
var budgetController = (function () {
    // some code
})();

// UI controller module
var UIController = (function(){
    var DOMStrings = {
        inputBtn: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();


// App controller module
var controller = (function(budgetCtrl, UICtrl){
    var input = UICtrl.getInput();
    var DOM = UICtrl.getDOMStrings();

    var ctrlAddItem = function(){
        console.log(input);
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keyPress', function(event){
       if(event.keycode == 13){
           ctrlAddItem();
       }
    });
})(budgetController,UIController);