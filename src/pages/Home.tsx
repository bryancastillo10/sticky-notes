import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

interface SmoothieData{
  id:number;
  title:string;
  method:string;
  rating:number;
}

interface SmoothieCardProps{
  id:number;
  title:string;
  method:string;
  rating:number;
  onDelete:(id:number)=> void;
}

const Home = () => {
  const [errorState, setErrorState] = useState<string|null>(null);
  const [smoothies, setSmoothies] = useState<SmoothieData[]|null>(null);


  const handleDelete = (id:number) => {
      setSmoothies( prevSmoothie => {
          if(!prevSmoothie) return null;
        return prevSmoothie?.filter(sm => sm.id !== id)
      })
  }
  useEffect(()=>{
     const fetchSmoothies = async () => {
      const {data,error} = await supabase
        .from('tutorial_table')
        .select()
        
        if(error){
          setErrorState("Failed to fetch the data");
          setSmoothies(null);
        }
        if(data){
          setSmoothies(data);
          setErrorState(null);
        }
     }

     fetchSmoothies();
  },[]);
  
  return (
    <div>
     {errorState && (<p>Something went wrong. Fetch error</p>)}
     {smoothies &&(
      <div className="grid grid-cols-2 xl:w-[50%] mx-auto gap-4">
        {smoothies.map((sm)=>(
          <SmoothieCard 
            key={sm.id}
            id={sm.id}
            title={sm.title}
            method={sm.method}
            rating={sm.rating}
            onDelete={handleDelete}
          />
        ))}
      </div>
     )}
    </div>
  )
}

export default Home;

const SmoothieCard = ({id,title,method,rating,onDelete}:SmoothieCardProps) => {
  const [deleteStatus, setDeleteStatus] = useState<string|null>(null);
  
  const handleDelete = async () =>{
      const {data, error} = await supabase
      .from('tutorial_table')
      .delete()
      .eq('id', id )
      .select()

      if(error){
        setDeleteStatus(error.message);
      }
      if(data){
        setDeleteStatus("The item has been successfully deleted");
        onDelete(id);
      }
  }

  return(
    <div className="border-2 border-teal-500 rounded-3xl shadow-md p-4 flex justify-between">
      <div className="">
        <h1 className="font-semibold">{title}</h1>
        <p className="text-sm">{method}</p>
        <Link to={`/${id}`}>
          <div className="flex items-center gap-2 bg-teal-500 text-white w-fit rounded-2xl px-2 my-2 ">
              <Edit3 size="14"/><span>Update</span>
          </div>
        </Link>
          <div 
            className="mt-2"
            onClick={handleDelete}
            >
            <Trash2 className="text-teal-500 hover:scale-90 cursor-pointer"/>
          </div>
        </div>
      <div className="mr-2">
        Rating: <p className="flex justify-center  items-center 
        bg-teal-500 text-white rounded-full size-10">{rating}</p>
      </div>
      {deleteStatus && <p>{deleteStatus}</p>}
  </div>
  )
}
