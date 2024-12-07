import { useRef, useContext } from "react";
import { NoteContext } from "@/context/NoteContext";
import PlusIcon from "@/assets/icons/PlusIcon";
import db from "@/data/database";

import type { INotesData } from "@/data/interface";
import type { Models } from "appwrite";
import colors from "@/assets/jsondata/colors.json";

const AddButton = ({ collectionName }: { collectionName: string }) => {
  const { setNotes } = useContext(NoteContext);
  const startingPos = useRef<number>(10); 
  
const addNote = async () => {         
    try {
        const collection = db[collectionName];
        if (!collection) {
            throw new Error(`Collection "${collectionName}" is not defined in the database configuration`); 
        }
        
        const payload: Omit<INotesData, keyof Models.Document> = {
          position: JSON.stringify({
              x: startingPos.current,
              y: startingPos.current
          }),
          colors: JSON.stringify(colors[0]),
          body: "New Notes Created"
        };
      
        startingPos.current += 10;
 
        const res = await collection.create(payload);
      
        setNotes((prevState) => [res, ...prevState]);
    }
    catch (error) {
        console.error("Error adding note:", error);
    }
  }
  return (
      <div
        id="add-btn"
        onClick={addNote}
    >
      <PlusIcon/>
    </div>
  )
}

export default AddButton
