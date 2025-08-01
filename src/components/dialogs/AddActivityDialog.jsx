'use client'

// React
import React, {useEffect, useState} from "react"

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
          
// Services
import agendaService from "../../services/agendaService";

const AddActivityDialog = ({visible, onHide, agendaId}) => {

    // ----- States ------
    // Input values
    const [initDate, setInitDate] = useState(null);
    const [desiredDate, setDesiredDate] = useState(null);

    // Miscelaneous
    const [loading, setLoading] = useState(false)

    // useEffect
    
    // ----- Handlers -----
    const handleSubmit = async () => {
        setLoading(true);
        try {
            /* Post */
        } catch (error) {
            console.error('Error al crear la agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        /* Reset dates to 0 */
        onHide();
    };

    return (
    <Dialog
      header={"Crear actividad"}
      visible={visible}
      onHide={handleCancel}
      style={{ width: '30rem' }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 m-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de inicio */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Fecha de inicio</label>
              <Calendar 
                value={initDate} 
                onChange={(e) => setInitDate(e.value)} 
                showIcon 
                className="w-full"
                dateFormat="dd/mm/yy"
                placeholder="Selecciona fecha de inicio"
              />
            </div>
          
            {/* Fecha deseada */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Fecha límite</label>
              <Calendar 
                value={desiredDate} 
                onChange={(e) => setDesiredDate(e.value)} 
                showIcon 
                className="w-full"
                dateFormat="dd/mm/yy"
                placeholder="Selecciona fecha límite"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !description}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                !name || !description
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default AddActivityDialog