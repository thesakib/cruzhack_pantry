import { getNouns } from "./winkNLP";

function fetchJsonCors(url: string, body?: object): Promise<any> {
    return fetch(url, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: body == null ? 'GET' : 'POST', // *GET, POST, PUT, DELETE, etc.
        body: body == null ? null : JSON.stringify(body),
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit",
    }).then(response => response.json())
}

export function edamamExtractFoods(foodText: string, callback: (foods: Parsed_Ingredients[]) => void) {
    const possibleFoodLabels = getNouns(foodText);
    console.log("possibleFoodLabels: ", possibleFoodLabels)

    // get food metadata:
    possibleFoodLabels.forEach(foodName => {
        const pureIngredients: Parsed_Ingredients[] = []
        fetchJsonCors("https://api.edamam.com/api/food-database/parser?nutrition-type=cooking&app_id=07d50733&app_key=80fcb49b500737827a9a23f7049653b9&ingr=" + foodName).then((foods: Edamam_Food_Db_Api_Response) => {
            if (foods['parsed'] == undefined) {
                throw Error("edamamExtractFoods - Got Wrong Response:" + JSON.stringify(foods))
            }
            console.info("foods response:", foods)
            let parsed = foods['parsed'] || [];
            if (parsed[0] && parsed[0].food) {
                const igd = parsed[0].food;
                pureIngredients.push({
                    pureName: igd['label'],
                    originalName: foodName,
                    dietLabels: [],
                    healthLabels: [],
                    imageUrl: igd['image']
                })
            } else {
                throw new Error('Food not found')
            }
            callback(pureIngredients);
        }).catch(err => {
            console.error("Err processing food:", foodName, "with edamam. error =", err);
            // if the api has an error, just return the raw foods:
            callback([{
                pureName: foodName,
                originalName: foodName,
                dietLabels: [],
                healthLabels: [],
                imageUrl: "",
            }]);
        })
    })
}

// export function edamamExtractFoodDb(foodText: string) {
//     // https://api.edamam.com/api/food-database/parser?nutrition-type=cooking&app_id=07d50733&app_key=80fcb49b500737827a9a23f7049653b9&ingr=chicken%20enchilada
//     const possibleFoodLabels = getNouns(foodText);
//     console.log("possibleFoodLabels: ", possibleFoodLabels)
//     return fetch("https://api.edamam.com/api/nutrition-details?app_id=47379841&app_key=d28718060b8adfd39783ead254df7f92", {
//         headers: {
//             "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0",
//             "Accept": "application/json",
//             "Accept-Language": "en-US,en;q=0.7,es;q=0.3",
//             "Content-Type": "application/json",
//         },
//         method: 'GET', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: "omit",
//     }).then(response => response.json()).then((foods: Edamam_Nutrition_Api_Response) => {
//         if (foods['ingredients'] == undefined) {
//             throw Error("edamamExtractFoods - Got Wrong Response:" + JSON.stringify(foods))
//         }
//         console.info("foods response:", foods)

//         const healthLabels = foods['healthLabels'] || [];
//         const dietLabels = foods['dietLabels'] || [];
//         const pureIngredients: Parsed_Ingredients[] = []
//         foods['ingredients'].forEach(ingredient => {
//             let parsed = ingredient['parsed'] || [];
//             parsed.forEach(parsed_ingredient => {
//                 pureIngredients.push({
//                     pureName: parsed_ingredient['food'],
//                     originalName: parsed_ingredient['foodMatch'],
//                     dietLabels: dietLabels,
//                     healthLabels: healthLabels,
//                     imageUrl: "https://www.edamam.com/food-img/296/296ff2b02ef3822928c3c923e22c7d19.jpg",
//                 })
//             });
//         });
//         return pureIngredients
//     }).catch(err => {
//         console.error(err);
//         // if the api has an error, just return the raw foods:
//         return possibleFoodLabels.map(foodName => ({
//             pureName: foodName,
//             originalName: foodName,
//             dietLabels: [],
//             healthLabels: [],
//             imageUrl: "https://www.edamam.com/food-img/296/296ff2b02ef3822928c3c923e22c7d19.jpg",
//         }));
//     })
// }

// edamamExtractFoods("I got some pasta and butter and lychee and some good old rum with tumeric syrup").then((foods) => localStorage.setItem("foods", JSON.stringify(foods)))
// console.dir(JSON.parse(localStorage.getItem("foods")))



// export function edamamExtractFoods(foodText: string, callback: ) {
//     const possibleFoodLabels = getNouns(foodText);
//     console.log("possibleFoodLabels: ", possibleFoodLabels)
//     return fetch("https://api.edamam.com/api/nutrition-details?app_id=47379841&app_key=d28718060b8adfd39783ead254df7f92", {
//         headers: {
//             "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0",
//             "Accept": "application/json",
//             "Accept-Language": "en-US,en;q=0.7,es;q=0.3",
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ "ingr": possibleFoodLabels }),
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: "omit",
//     }).then(response => response.json()).then((foods: Edamam_Nutrition_Api_Response) => {
//         if (foods['ingredients'] == undefined) {
//             throw Error("edamamExtractFoods - Got Wrong Response:" + JSON.stringify(foods))
//         }
//         console.info("foods response:", foods)

//         const healthLabels = foods['healthLabels'] || [];
//         const dietLabels = foods['dietLabels'] || [];
//         const pureIngredients: Parsed_Ingredients[] = []
//         foods['ingredients'].forEach(ingredient => {
//             let parsed = ingredient['parsed'] || [];
//             parsed.forEach(parsed_ingredient => {
//                 pureIngredients.push({
//                     pureName: parsed_ingredient['food'],
//                     originalName: parsed_ingredient['foodMatch'],
//                     dietLabels: dietLabels,
//                     healthLabels: healthLabels,
//                     imageUrl: "https://www.edamam.com/food-img/296/296ff2b02ef3822928c3c923e22c7d19.jpg",
//                 })
//             });
//         });
//         return pureIngredients
//     }).catch(err => {
//         console.error(err);
//         // if the api has an error, just return the raw foods:
//         return possibleFoodLabels.map(foodName => ({
//             pureName: foodName,
//             originalName: foodName,
//             dietLabels: [],
//             healthLabels: [],
//             imageUrl: "https://www.edamam.com/food-img/296/296ff2b02ef3822928c3c923e22c7d19.jpg",
//         }));
//     })
// }
