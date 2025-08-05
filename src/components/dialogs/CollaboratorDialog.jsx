'use client'

// React
import React, { useEffect, useState, useRef } from "react"

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';

// Services
import agendaService from "../../services/agendaService";
import userService from "../../services/userService";
import collaboratorService from "../../services/collaboratorService"

// Components
import { createToastService } from "../toasts/createToastService";


const CollaboratorDialog = ({visible, onHide, agendaName, collaboratorToEdit, agendaId, activeCollaborators, mode, onSuccess }) => {
  // User context
  const currentUser = useSelector((state) => state.auth.user);
  // Role mappings
  const CollaboratorRol = {
    ADMIN: 'a',
    LEADER: 'l',
    WORKER: 'w',
  };
  const rolOptions = [
    { label: 'Administrador', value: CollaboratorRol.ADMIN },
    { label: 'Líder', value: CollaboratorRol.LEADER },
    { label: 'Colaborador', value: CollaboratorRol.WORKER }
  ];

  // ----- Theme -----
  const theme = useSelector((state) => state.theme.currentTheme);
  const isDark = theme === "arya-blue";
  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);

  // ----- States ------
  // Entities
  const [collaborators, setCollaborators] = useState([]);
  const [selectableCollaborators, setSelectableCollaborators] = useState([])

  // Inputs
  const [selectedCollaborator, setSelectedCollaborator] = useState(collaboratorToEdit);
  const [rol, setRol] = useState(CollaboratorRol.WORKER);
  // Miscelaneous
  const [loading, setLoading] = useState(false);

  // ----- Dataloading -----
  useEffect(() => {
    fetchCollaborators();
  }, []);   

  useEffect(() => {
    if (mode === 'create' && collaborators.length > 0) {
      const activeIds = (activeCollaborators || []).map(col => col.user.id);
      const filtered = collaborators.filter(
        user => user.id !== currentUser.id && !activeIds.includes(user.id)
      );
      setSelectableCollaborators(filtered);
    } 
  }, [mode, activeCollaborators, collaborators, currentUser]);

  useEffect(() => {
    if (mode === 'edit' && collaboratorToEdit) {
      setSelectedCollaborator(collaboratorToEdit.user);
      setRol(collaboratorToEdit.rol);
    }
  }, [mode, collaboratorToEdit]);

  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const response = await userService.fetchUsers();
      setCollaborators(response)
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log('collaborator to edit: ', collaboratorToEdit)
  },[collaboratorToEdit])
  // ----- Handlers -----
  const handleSubmit = async () => {
    try {
      if (mode === 'edit') {
        const payload = {
          userId: collaboratorToEdit.id,
          rol: rol
        }
        await collaboratorService.patchCollaborator(collaboratorToEdit.id, payload);
        toast.showSuccess("Se editó el colaborador seleccionado")
        setTimeout(() => {
          onSuccess();
          onHide();
        }, 1000);
      } else {
        const payload = {
          userId: selectedCollaborator.id,
          rol: selectedCollaborator.rol
        }
        await agendaService.postCollaboratorToAgenda(agendaId, payload);
        toast.showSuccess('Colaborador agregado exitosamente!')
        setTimeout(() => {
          onSuccess();
          onHide();
        }, 1000);
      }
    } catch (error) {
      toast.showError('Error: ', error)
    }
  }

  const handleRemoveCollaboratorFromAgenda = async (id) => {
    try {
      await collaboratorService.deleteCollaborator(id);
      toast.showSuccess("Se elimino el colaborador de esta agenda")
      onSuccess();
      onHide();
    } catch (error) {
      toast.showError('Error: ', error)
    }
  }

  const handleCancel = () => {
    onHide();
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center m-4 space-x-4">
          <h2 className="text-lg font-semibold">{mode === 'create' ? 'Agregar' : 'Editar'} colaborador</h2>
          {mode === 'create' ? null : (<Button icon="pi pi-trash" onClick={() => handleRemoveCollaboratorFromAgenda(collaboratorToEdit.id)}/>)}
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
          {/* Usuario asignado */}
          <div className="mb-4">
            <label className=" font-medium block mb-2">Colaboradores para {agendaName}</label>
            <Dropdown
                value={selectedCollaborator}
                options={mode === 'edit' ? [collaboratorToEdit.user] : selectableCollaborators}
                onChange={(e) => setSelectedCollaborator(e.value)}
                optionLabel="name" 
                disabled={mode === 'edit'}
                placeholder="Selecciona colaboradores"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Rol */}
          <div>
            <label className=" font-medium">Rol</label>
            <Dropdown
                value={rol}
                options={rolOptions}
                onChange={(e) => setRol(e.value)}
                placeholder="Selecciona un rol"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center gap-4 mt-4 mb-4">
            <div className="flex gap-2">
              <Button
                label="Cancelar"
                onClick={handleCancel}
                className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
              />
              <Button
                label={collaboratorToEdit ?  "Editar" : "Agregar"  }
                onClick={handleSubmit}
                // disabled={!selectedCollaborator}
                className={`${isDark 
                    ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
                    : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"
                } 
                text-white text-sm px-4 py-1 rounded-md transition-colors duration-200 font-medium`}
              />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CollaboratorDialog;
