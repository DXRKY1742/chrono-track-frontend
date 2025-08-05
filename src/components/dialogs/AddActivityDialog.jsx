'use client'

// React
import React, { useEffect, useState, useRef } from "react"

// Redux
import { useSelector } from 'react-redux';

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import 'primeicons/primeicons.css';

// Services
import agendaService from "../../services/agendaService";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";

// Components
import { createToastService } from "../toasts/createToastService";

const priorities = [
  { label: 'Alta', value: 'h' },
  { label: 'Media', value: 'm' },
  { label: 'Baja', value: 'l' }
];

const AddActivityDialog = ({ visible, onHide, agendaId, suggestedInitDate }) => {
  // ----- Theme -----
  const theme = useSelector((state) => state.theme.currentTheme);
  const isDark = theme === "arya-blue";
  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);
  // ----- States ------
  // Entities
  const [collaborators, setCollaborators] = useState([]);
  const [categories, setCategories] = useState([]);
  // Task inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initDate, setInitDate] = useState(null);
  const [desiredDate, setDesiredDate] = useState(null);
  const [priority, setPriority] = useState('m');
  const [userAssignedId, setUserAssignedId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  // Miscelaneous
  const [loading, setLoading] = useState(false);

  // ----- useEffect -----
  useEffect(() => {
    fetchCollaborators();
    fetchCategories();
  }, []);

  const fetchCollaborators = async () => {
    setLoading(true)
    try {
      const response = await userService.fetchUsers();
      setCollaborators(response)
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryService.fetchCategory();
      setCategories(response)
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  // ----- Handlers -----
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        initDate,
        desiredDate,
        priority,
        userAssignedId,
        agendaId,
        categoryId
      };

      await agendaService.postTaskToAgenda(agendaId, payload);
      toast.showSuccess('Actividad creada exitosamente')
      setTimeout(() => {
        onHide();
      }, 1000); 
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setInitDate(null);
    setDesiredDate(null);
    setPriority('m');
    setUserAssignedId(null);
    setCategoryId(null);
    onHide();
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center m-4">
          <h2 className="text-lg font-semibold">Crear actividad</h2>
        </div>
      }
      visible={visible}
      onHide={handleCancel}
      style={{ width: '35rem' }}
    >
      <Toast ref={toastRef} />
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 m-5">
          {/* Título */}
          <div>
            <label className=" font-medium">Título</label>
            <InputText
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la actividad"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className=" font-medium">Descripción</label>
            <InputTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe la actividad"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className=" font-medium">Fecha de inicio</label>
              <Calendar 
                value={initDate} 
                onChange={(e) => setInitDate(e.value)} 
                showIcon 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                dateFormat="dd/mm/yy"
                placeholder="Selecciona fecha de inicio"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className=" font-medium">Fecha límite</label>
              <Calendar 
                value={desiredDate} 
                onChange={(e) => setDesiredDate(e.value)} 
                showIcon 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                dateFormat="dd/mm/yy"
                placeholder="Selecciona fecha límite"
                minDate={initDate}
              />
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className=" font-medium">Prioridad</label>
            <Dropdown
              value={priority}
              options={priorities}
              onChange={(e) => setPriority(e.value)}
              placeholder="Selecciona prioridad"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Usuario asignado */}
          <div className="mb-4">
            <label className=" font-medium block mb-2">Responsable</label>
            <Dropdown
              value={userAssignedId}
              onChange={(e) => setUserAssignedId(e.value)}
              options={collaborators}
              optionLabel="name"
              optionValue="id"
              placeholder="Selecciona un colaborador"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Categoría (opcional) */}
          <div className="mb-4">
            <label className=" font-medium block mb-2">Categoria (Opcional)</label>
            <Dropdown
              value={categoryId}
              onChange={(e) => setCategoryId(e.value)}
              options={categories}
              optionLabel="title"
              optionValue="id"
              placeholder="Selecciona una categoria"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              label="Cancelar"
              onClick={handleCancel}
              className="p-button-secondary"
            />
            <Button
              label="Guardar"
              onClick={handleSubmit}
              disabled={!title || !description || !initDate || !userAssignedId}
              className={`${isDark 
                ? !title || !description
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
                : !title || !description
                  ? "bg-blue-300 border-blue-300 cursor-not-allowed"
                  : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"
              } 
              text-white text-sm px-4 py-1 rounded-md transition-colors duration-200 font-medium`}
            />
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default AddActivityDialog;
