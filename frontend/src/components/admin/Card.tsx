import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "../Button";




type CardProps ={
    title:string;
    children:ReactNode
}

const Card = ({title,children}:CardProps) => {
  return (
    <div className="flex flex-col rounded-lg justify-center border-2 items-center">
      <div>
          <h1 className="text-3xl p-6 ">{title}</h1>
      </div>
      <div>
     {children}
      </div>
      <div className="flex w-full p-3 items-end justify-center">
        <Link className="grow" to={`/admin/${title.toLowerCase()}`}><Button className="w-full">Vist</Button></Link>
      </div>
      
    </div>
  )
}

export default Card
