import { Link } from "react-router-dom";


export default function Navbar(){

return (

<nav className="p-5 shadow">

<div className="flex justify-between">


<h1 className="font-bold text-xl">
Mpumudde High School
</h1>


<div className="space-x-5">

<Link to="/">
Home
</Link>

<Link to="/about">
About
</Link>


<Link to="/academics">
Academics
</Link>


<Link to="/news">
News
</Link>


<Link to="/contact">
Contact
</Link>


</div>


</div>


</nav>

);

}