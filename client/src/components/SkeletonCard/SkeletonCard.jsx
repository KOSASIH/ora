import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const SkeletonCard = () => {
  return (
    <section className="">
    <ul className="list text-center">
      {Array(1)
        .fill()
        .map((item, index) => (
          <li className="card"  key={index}  style={{display:"flex", gap:"10px"}}>
            <div className="card-image text-center" style={{marginLeft:"10px"}}>
                <Skeleton circle={true} height={50} width={50} />
            </div>
            <div  style={{flex:"1"}}>
              <h4 className="card-description">
                  <Skeleton width={200} />
              </h4>
              <h4 className="card-description">
                  <Skeleton width={200} />
              </h4>
            </div>
          </li>
        ))}
    </ul>
  </section>
  );
};
export default SkeletonCard;