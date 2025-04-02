"use client"
import Banner from '@/components/Banner'
import Card from "@/components/Card"
import Link from 'next/link';

import {useReducer} from "react"

export default function Home() {
    let defaultcoworking = new Map<string,number> ([
        ["The Bloom Pavilion",0],
        ["Spark Space",0],
        ["The Grand Table",0],
    ]);
    const cardReducer = (
        coworkingList : Map<string,number>,
        action : {type:string; coworkingName:string;rating? : number}
    ) => {
        switch(action.type) {
            case 's' : {
                const newcoworkingList = new Map(coworkingList);
                newcoworkingList.set(action.coworkingName,action.rating??0);
                return newcoworkingList;
            }
            case 'a' : {
                const newcoworkingList = new Map(coworkingList);
                newcoworkingList.delete(action.coworkingName);
                return newcoworkingList;
            }
            default : return coworkingList;
        }
    }
    const [coworkingList,dispatchRating] = useReducer(cardReducer, defaultcoworking);

    const mockcoworkingList = [
        {vid : "001" , name : "The Bloom Pavilion",image : "/img/bloom.jpg"},
        {vid : "002" , name : "Spark Space",image : "/img/sparkspace.jpg"},
        {vid : "003" , name : "The Grand Table",image : "/img/grandtable.jpg"},
    ]
    return (
        <div>
            <div style = {{margin : "20px",display : "flex",flexDirection : "row",flexWrap:"wrap",justifyContent:"space-around",alignContent : "space-around"}}>
                {
                    mockcoworkingList.map((coworkingItem)=> (
                        <Link href={`/coworking/${coworkingItem.vid}`} className = 'w-1/5'>
                        <Card coworkingName = {coworkingItem.name} imgSrc = {coworkingItem.image} onRating = {(coworkingName:string,rating:number)=>dispatchRating({type:'s',coworkingName:coworkingName,rating:rating})}/>
                        </Link>
                    ))
                }
            </div>
            <div className = 'w-full text-2xl font-medium'>coworking List with Ratings : {coworkingList.size}</div>
            {Array.from(coworkingList).map(([coworkingName,rating])=> <div data-testid={coworkingName} key = {coworkingName} className = 'text-xl' onClick={()=>dispatchRating({type:'a',coworkingName:coworkingName,rating:0})}> {coworkingName} : {rating} </div>)}
        </div>
    );
}