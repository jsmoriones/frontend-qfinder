import React, { useEffect } from "react";
import Slider from "react-slick";
import Cookies from "js-cookie";
import CardPaciente from "../../components/CardPaciente";
import { useAuth } from "../../context/PacienteContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { estadisticas } from "../../services/dashboardService";
import DashboardStats from "../../components/DashboardStats";
import ResumenEstadosChart from "../../components/DashboardStats";
import DashboardAnalitico from "../../components/DashboardStats";
import DashboardGraficos from "../../components/DashboardStats";

const Dashboard = () => {

  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  /*useEffect(() => {
    if(isAuthenticated){
      navigate("/dashboard")
    }else{
      navigate("/login")
    }
  }, [isAuthenticated])*/

  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 448,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  };

  const fetchEstadisticas = async () => {
    const response = await estadisticas();
    console.log(response)
  }
  
  useEffect(() => {
    fetchEstadisticas();
  }, [])

  return (
    <>
      {/* Carousel Pacientes */}
      <div className="container p-5">
        <DashboardGraficos/>
      </div>
    </>
  );
};

export default Dashboard;