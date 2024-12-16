import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux"
import { selectCategories } from "../features/categories/categoriesSlice"


function CategorySelect(){
    const categories= useSelector(selectCategories)


    return(
        <section className="categories">
            <h1>Explore all categories</h1>
            {
                categories.map((category, index)=>{
                    return(
                        <Link key={index} to={`/category/${category}`}><span>{category}</span></Link>
                    )
                })
            }
        </section>
    )
}

export default CategorySelect