import React,{useState, useEffect, useCallback} from 'react'
import './choosetopics.scss'
import { useNavigate} from 'react-router-dom'
import {  userState$,categoriesState$ }from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
const ChooseTopics = () => {
  // dispatch actions
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [active, setActive] = useState([]);
  const [data, setData] = useState({
    category:""
  });
  const categorise = useSelector(categoriesState$);
  const user = useSelector(userState$);
  const getCategories = useCallback(() => {
    dispatch(actions.getAllCategories.getAllCategoriesRequest());
  }, [dispatch]);
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  const handelActive = (id ) => {
    setActive(prev => {
      if(prev.includes(id)){
        const activeItem = prev.filter((e)=> {
          return e !== id
        })
        return activeItem
      }
      else {
        return [...prev,id]
      }
    }
    );
  }
  useEffect(()=>{
    setData(active)
  },[active])
  const onSubmit = useCallback((e) => {
    try{
      e.preventDefault();
      dispatch(actions.createCategoryUser.createCategoryUserRequest(data))
    }
    catch(err){ 
      dispatch(actions.createCategoryUser.createCategoryUserFailure())
    }
  },[dispatch, data])
  useEffect(() => {
      if(user.categoryUser){
        window.location.href = '/';
      }
  },[user.categoryUser, navigate])
  return (
    <section className='topics'> 
      <div className="topics__container">
        <header className="topics__header">
          <div className="topics__header-top">
            <h3 className='topics__header-top-title'>Bắt đầu vào việc theo dõi chủ đề bạn quan tâm</h3>
            <button className='topics__header-top-button' type='submit' onClick={onSubmit} >Xác nhận</button>
          </div>
          <p>Chúng tôi sẽ giúp bạn dễ dàng tiếp cận các bài viết trong chủ đề này</p>
        </header>
        <main className='topics__content'>
          <div className="grid">
            <div className="row">
              {
                categorise.data.map((category,i)=> (
                  <div key={i}className="col l-3"
                    onClick={() => handelActive(category._id)}
                  >
                    <div className={`topics__content-container ${ 
                      active ? active.some((id) => id === category._id) ? "active" : "" : ""                
                      }`} >
                      <p className="topics__content-text">{category.name}</p>
                    </div>
                </div>
                ))
              }        
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default ChooseTopics