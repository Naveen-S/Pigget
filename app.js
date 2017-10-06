// Budget controller module
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentages = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (arr) {
        var sum = 0;
        /*
         data.allItems[type].forEach(function(item){
         sum += item.value;
         });
         return sum;*/
        arr.forEach(function (item) {
            sum += item.value;
        });
        return sum;
    };

    var calculatePercentageExpense = function (expense, income) {
        return Math.round((expense / income) * 100);
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {

        addItem: function (type, des, val) {
            var newItem, id = 0;
            // id = id of last element +1
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            // Create new Expense or Income object based on type.
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            }
            else if (type == 'inc') {
                newItem = new Income(id, des, val);
            }
            // Push to appropriate DS.
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            data.allItems[type].forEach(function (item, index) {
                if (item.id == id) {
                    data.allItems[type].splice(index, 1)
                }
            })
        },


        calculateBudget: function () {
            // Calculate total Income and expense.
            data.total['exp'] = calculateTotal(data.allItems['exp']);
            data.total['inc'] = calculateTotal(data.allItems['inc']);

            // Calculate Budget.
            data.budget = data.total.inc - data.total.exp;

            // Calculate Total expense percentage.
            if (data.total.inc > 0) {
                data.percentage = calculatePercentageExpense(data.total.exp, data.total.inc);
            } else {
                data.percentage = -1;
            }

            return data;
        },

        calculatePercentages: function () {

            // Calculate percentage for each expense
            data.allItems.exp.forEach(function (item) {
                item.calcPercentages(data.total.inc);
            });

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalexpense: data.total.exp,
                percentage: data.percentage
            };
        },

        getPercentages: function () {
            // get Percentages.
            var percentages = data.allItems.exp.map(function (item) {
                return item.percentage;
            });
            return percentages;
        },


        test: function () {
            console.log(data);
        }
    }


})();


// UI controller module
var UIController = (function () {
    var DOMStrings = {
        inputBtn: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        monthLabel: '.budget__title--month',
        top: '.top'
    };

    var formatNumber = function (number, type) {
        var num, int, decimal;
        num = Math.abs(number);

        num = num.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})

        return (type == 'inc' ? '+' : '-') + ' ' + num;
    };

    var nodeListforEach = function (nodeList, callback) {
        for (var i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
    };

    return {

        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        addListItem: function (newItem, type) {
            var html, newhtml, element;
            if (type == 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> ' +
                    '<div class="right clearfix"> <div class="item__value">%value%</div> ' +
                    '<div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div> </div> </div>'
            }
            else if (type == 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div>' +
                    ' <div class="right clearfix"> <div class="item__value">%value%</div> ' +
                    '<div class="item__percentage">21%</div> <div class="item__delete"> ' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div> </div> </div>'
            }

            newhtml = html.replace('%id%', newItem.id);
            newhtml = newhtml.replace('%description%', newItem.description);
            newhtml = newhtml.replace('%value%', formatNumber(newItem.value, type));
            // Add element to DOM
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newhtml);
        },

        deleteListItem: function (itemId) {
            var el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (item, index, array) {
                item.value = '';
            });
            fieldsArray[0].focus();
        },

        displayBudget: function (budget) {
            var type;
            budget.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(budget.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(budget.totalIncome, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(budget.totalexpense, 'exp');
            if (budget.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = budget.percentage + '%';
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            var list = document.querySelectorAll(DOMStrings.expensePercLabel);

            nodeListforEach(list, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function () {
            var month_names_short, month_names, month, year, now;
            month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.monthLabel).textContent = month_names_short[month] + ' ' + year;
        },

        changedType: function () {
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListforEach(fields, function (item) {
                item.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        manageBackground: function () {
            var num = Math.floor(Math.random() * 5) + 1;
            document.querySelector(DOMStrings.top).classList.add('backgroundImage-' + num);
        }
    }

})();


// App controller module
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keyPress', function (event) {
            if (event.keycode == 13 || event.which == 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {

        // Calculate budget
        budgetCtrl.calculateBudget();

        // Get budget
        var budget = budgetCtrl.getBudget();

        //Update UI.
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        // Calculate Percentage
        budgetCtrl.calculatePercentages();

        // get Percentages
        var percentages = budgetCtrl.getPercentages();

        // Display percentages on UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        // Get data from UI.
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // Add data to DS.
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Display added data to UI.
            UICtrl.addListItem(newItem, input.type);

            // Clear fields.
            UICtrl.clearFields();

            // Update the data structure.
            updateBudget();

            updatePercentages();

        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, type, id;
        // Identity the item
        // Check since event.target is different for Chrome and mozilla.
        if(window.navigator.userAgent.indexOf('Chrome') > 0) {
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        }else{
            itemID = event.target.parentNode.parentNode.parentNode.id;
        }
        if (itemID) {
            type = itemID.split('-')[0];
            id = itemID.split('-')[1];
            // Delete from the DS
            budgetCtrl.deleteItem(type, id);
        }
        //Delete the item from UI
        UICtrl.deleteListItem(itemID);

        // Refresh the UI
        updateBudget();

        // refresh percentages
        updatePercentages();
    };

    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalexpense: 0,
                percentage: -1
            });
            UICtrl.displayMonth();
            UICtrl.manageBackground();
        }
    }


})(budgetController, UIController);

controller.init();