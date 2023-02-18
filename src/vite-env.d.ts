/// <reference types="vite/client" />

type Edamam_Nutrition_Api_Response = {
    healthLabels: string[],
    dietLabels: string[],
    ingredients: [
        {
            parsed: [
                {
                    food: string;
                    foodMatch: string;
                }
            ]
        }
    ]
}

type Edamam_Food_Db_Api_Response = {
    text: string;
    parsed: [
        {
            food: {
                label: string;
                category: string;
                categoryLabel: string;
                image: string;
                foodId: string;
            }
        }
    ]
}

type Parsed_Ingredients = {
    pureName: string;
    originalName: string;
    imageUrl: string;
    healthLabels: string[];
    dietLabels: string[];
}

type Recipe_Data = {
    title: string;
    body: string;
}
