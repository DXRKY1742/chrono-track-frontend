'use client'

// React
import React, { useEffect, useState, useRef } from "react"

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from 'primereact/button';
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import 'primeicons/primeicons.css';

// Services
import taskService from "../../services/tasksService";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";

// Components
import {createToastService} from "../../../components/toast/createToastService";

const priorities = [
  { label: 'Alta', value: 'h' },
  { label: 'Media', value: 'm' },
  { label: 'Baja', value: 'l' }
];

const ActivityDialog = ({ visible, onHide, onActivitySaved, activityToEdit }) => {
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
  const [localActivity, setLocalActivity] = useState(activityToEdit); 
  // Miscelaneous
  const [loading, setLoading] = useState(false);

  // ----- useEffect -----
  useEffect(() => {
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
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setLocalActivity(activityToEdit);
  }, [activityToEdit]);

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
      toast.showSuccess('Actualizado')
    } catch (error) {
      toast.showError('Error: ', error)
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
      toast.showSuccess('Actualizado') 
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  const toggleInProgress = async (newState) => {
    if (!localActivity) return;
    setLoading(true);
    try {
      await taskService.patchTask(localActivity.id, { state: newState });
      setLocalActivity({ ...localActivity, state: newState });
      toast.showSuccess('Actualizado')
    } catch (error) {
      toast.showError('Error: ', error)
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
        <div className="flex justify-between items-center m-4 space-x-4">
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
          <div className="flex justify-between items-center gap-4 mt-4 mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                inputId="stateToggle"
                checked={localActivity?.state === 'p'}
                onChange={(e) => {
                  const newState = e.checked ? 'p' : 'a';
                  toggleInProgress(newState);
                }}
                className="rounded"
                style={{
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.25rem',
                  boxSizing: 'border-box',
                }}
              />
              <label
                htmlFor="stateToggle"
                className="text-xs text-gray-700 cursor-pointer select-none"
              >
                En progreso
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                label="Cancelar"
                onClick={handleCancel}
                className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
              />
              <Button
                label="Actualizar"
                onClick={handleSubmit}
                disabled={!title || !description}
                className={`px-4 py-1 text-sm rounded-md font-medium text-white transition border ${
                  !title || !description
                    ? 'bg-blue-300 border-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
                }`}
              />
            </div>
          </div>

        </div>
      )}
    </Dialog>
  );
};

export default ActivityDialog;
