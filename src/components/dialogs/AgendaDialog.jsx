'use client'

// React
import React, {useEffect, useState} from "react"

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeicons/primeicons.css';
          
// Services
import agendaService from "../../services/agendaService";

const AgendaDialog = ({visible, onHide, onAgendaSaved, agendaToEdit}) => {
    
    // ----- States ------
    // Input values
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    // Miscelaneous
    const [loading, setLoading] = useState(false)

    // useEffect
    useEffect(() => {
      if (agendaToEdit) {
        setName(agendaToEdit.name || '');
        setDescription(agendaToEdit.description || '');
      } else {
        setName('');
        setDescription('');
      }
    }, [agendaToEdit, visible]);
    
    // ----- Handlers -----
    const handleSubmit = async () => {
        setLoading(true);
        try {
          if(agendaToEdit?.id){
            await agendaService.patchAgenda(agendaToEdit.id, {name, description})
          } else {
            await agendaService.postAgenda({ name, description });
          }
          onAgendaSaved?.();
          setName('');
          setDescription('');
          onHide();
        } catch (error) {
            console.error('Error al crear la agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName('');
        setDescription('');
        onHide();
    };

    return (
    <Dialog
      header={agendaToEdit ? "Editar agenda" : "Crear nueva agenda"}
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
          <input
            type="text"
            id="agendaName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la agenda"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            id="agendaDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            rows={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !description}
              className={`px-4 py-2 rounded-md font-semibold text-white transition bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700`}
            >
              {agendaToEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default AgendaDialog