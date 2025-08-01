'use client'

// React
import React, {useEffect, useState} from "react"

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
          
// Services
import taskService from "../../services/tasksService";

const ActivityDialog = ({visible, onHide, onActivitySaved, activityToEdit}) => {

    // ----- States ------
    // Input values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [desiredDate, setDesiredDate] = useState(null);
    const [priority, setPriority] = useState('m');

    // Priority selector
    const priorityOptions = [
      { label: 'Alta', value: 'h' },
      { label: 'Media', value: 'm' },
      { label: 'Baja', value: 'l' },
    ];

    // Miscelaneous
    const [loading, setLoading] = useState(false)

    // useEffect
    useEffect(() => {
        if (activityToEdit) {
        setTitle(activityToEdit.title || '');
        setDescription(activityToEdit.description || '');
        setDesiredDate(activityToEdit.desiredDate ? new Date(activityToEdit.desiredDate) : null);
        setPriority(activityToEdit.prority || 'm');
        } else {
        setTitle('');
        setDescription('');
        setDesiredDate(null);
        setPriority('m');
        }
    }, [activityToEdit, visible]);    

    // ----- Handlers -----
    const handleSubmit = async () => {
        setLoading(true);
        try {
        const updatedActivity = {
            ...activityToEdit,
            title,
            description,
            desiredDate: desiredDate ? desiredDate.toISOString().split('T')[0] : null,
            prority: priority,
        };
        await taskService.updateActivity(updatedActivity);
        onActivitySaved();
        onHide();
        } catch (error) {
        console.error('Error al actualizar la actividad:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleCancel = () => {
        /* Reset values */
        onHide();
    };

    return (
    <Dialog
      header={"Editar actividad"}
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
          <InputText
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la actividad"
            className="w-full"
          />

          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            rows={4}
            className="w-full"
          />

          <Calendar
            value={desiredDate}
            onChange={(e) => setDesiredDate(e.value)}
            placeholder="Fecha límite"
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
          />

          <Dropdown
            value={priority}
            options={priorityOptions}
            onChange={(e) => setPriority(e.value)}
            placeholder="Prioridad"
            className="w-full"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                !name || !description
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Actualizar
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default ActivityDialog