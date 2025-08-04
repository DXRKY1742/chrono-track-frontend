'use client'

// React
import React, { useEffect, useState } from "react"

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
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";

const priorities = [
  { label: 'Alta', value: 'h' },
  { label: 'Media', value: 'm' },
  { label: 'Baja', value: 'l' }
];

const ActivityDialog = ({ visible, onHide, onActivitySaved, activityToEdit }) => {

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
    console.log(activityToEdit)
    if (activityToEdit) {
      setTitle(activityToEdit.title || '');
      setDescription(activityToEdit.description || '');
      setInitDate(activityToEdit.initDate ? new Date(activityToEdit.initDate) : null);
      setDesiredDate(activityToEdit.desiredDate ? new Date(activityToEdit.desiredDate) : null);
      setPriority(activityToEdit.priority || 'm');;
      setUserAssignedId(activityToEdit.userAssignedId ?? null);
      setCategoryId(activityToEdit.categoryId ?? null);
    } else {
      setTitle('');
      setDescription('');
      setInitDate(null);
      setDesiredDate(null);
      setPriority('m');
    }
  }, [activityToEdit, visible]);

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
      console.error('Error obtener collaboradores:', error);
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
      console.error('Error al obtener categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  // ----- Handlers -----
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedActivity = {
        title,
        description,
        desiredDate: desiredDate ? desiredDate.toISOString().split('T')[0] : null,
        userAssignedId: userAssignedId ? Number(userAssignedId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        priority
      };
      await taskService.patchTask(activityToEdit.id, updatedActivity);
      onActivitySaved();
      onHide();
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!activityToEdit) return;
    setLoading(true);
    try {
      await taskService.patchTask(activityToEdit.id, { state: 'c', completedDate: new Date() });
      onActivitySaved(); 
      onHide();           
    } catch (error) {
      console.error('Error al marcar como completado:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    onHide();
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center m-4">
          <h2 className="text-lg font-semibold">Editar actividad</h2>
          <Button 
            label="Marcar completado" 
            icon="pi pi-check" 
            className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white border-none"
            onClick={handleMarkCompleted}
          />
        </div>
      }
      visible={visible}
      onHide={handleCancel}
      style={{ width: '30rem', borderRadius: '1rem' }} 
      contentClassName="p-2"
    >
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
                disabled
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
              label="Actualizar"
              onClick={handleSubmit}
              disabled={!title || !description}
              className={`px-4 py-2 rounded-md font-semibold text-white transition bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 ${!title || !description ? 'p-button-disabled' : ''}`}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ActivityDialog;
