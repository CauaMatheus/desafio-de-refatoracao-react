import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface Food {
  id: number,
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface FoodsContextData {
  foods: Food[];
  editingFood: Food;
  handleAddFood(food: Food): Promise<void>;
  handleUpdateFood(food: Food): Promise<void>;
  handleDeleteFood(id: number): Promise<void>;
  setEditingFood(food: Food): void;
}

const FoodsContext = createContext<FoodsContextData>({} as FoodsContextData)

export const FoodsContextProvider: React.FC = ({children}) => {
  const [foods, setFoods] = useState<Food[]>([])
  const [editingFood, setEditingFood] = useState<Food>({} as Food)

  useEffect(() => {
    (async () => {
      const response = await api.get('/foods');

      setFoods(response.data)
    })()
  }, [])

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  function handleSetEditingFood(food: Food) {
    setEditingFood(food)
  }

  return (
    <FoodsContext.Provider value={{
      foods,
      editingFood,
      handleAddFood,
      handleUpdateFood,
      handleDeleteFood,
      setEditingFood: handleSetEditingFood
    }}>
      {children}
    </FoodsContext.Provider>
  )
}

export function useFoods() {
  const context = useContext(FoodsContext)
  return context
}