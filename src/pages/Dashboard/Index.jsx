import React, { useEffect, useState } from "react";
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
  const [dataGraficos, setDataGraficos] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true)
    try {
      const response = await estadisticas();
      if(response.status === 200){
        setDataGraficos(response.data);
      }
      console.log(response)
    } catch (error) {
      console.log("hubo un error en la informacion de los graficos: ", error);
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchEstadisticas();
  }, [])

  return (
    <>
      {/* Carousel Pacientes */}
      <div className="container p-5">
        {
          loading ?
            <p>Cargando...</p>
          : <DashboardGraficos data={dataGraficos} />
        }
      </div>
    </>
  );
};

export default Dashboard;