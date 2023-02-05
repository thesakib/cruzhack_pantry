let app = {};

let init = (app) => {
    app.data = {
        food_list: [],
        new_food: "",
    };

    
    app.add_food = function () {
        axios.post(add_food_url, {
            food_name: app.vue.new_food
        }).then(response => {
            app.vue.food_list.push(app.vue.new_food);
            app.vue.new_food = "";
        }).catch(error => {
            console.error(error);
        });
    };

    app.get_foods = function () {
        axios.get(get_foods_url).then(response => {
            app.vue.food_list = response.data.foods.map(food => food.food_name);
        }).catch(error => {
            console.error(error);
        });
    };

    app.remove_food = function (food_name) {
        console.log(app.vue.food_list);
        for (let i = 0; i < app.vue.food_list.length; i++) {
            if (app.vue.food_list[i] === food_name) {
                app.vue.food_list.splice(i, 1);
                break;
            }
        }
        console.log(app.vue.food_list);
        axios.post(remove_food_url, { food_name: food_name })
    };

    app.methods = {
        add_food: app.add_food,
        remove_food: app.remove_food,
    };

    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    app.init = () => {
        app.get_foods();
    };

    app.init();
};

init(app);
