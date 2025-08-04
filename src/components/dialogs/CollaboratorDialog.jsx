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
import {createToastService} from "../../../components/toast/createToastService";


const CollaboratorDialog = ({ visible, onHide, agendaId, agendaName, activeCollaborators, mode, collaboratorToEdit }) => {
  const currentUser = useSelector((state) => state.auth.user);

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

  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);
  // ----- States ------
  // Entities
  const [collaborators, setCollaborators] = useState([]);
  // Inputs
  const [selectedCollaborator, setSelectedCollaborator] = useState(collaboratorToEdit?.id);
  const [rol, setRol] = useState(CollaboratorRol.WORKER);
  // Miscelaneous
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollaborators();
    }, []);
  
    const fetchCollaborators = async () => {
      setLoading(true);
      try {
        const response = await userService.fetchUsers();
        const activeIds = (activeCollaborators || []).map(col => col.userId);
        let filtered = response.filter(
          user => user.id !== currentUser.id && !activeIds.includes(user.id)
        );
        if (mode === 'edit' && collaboratorToEdit) {
          const editingUser = response.find(user => user.id === collaboratorToEdit.userId);
          if (editingUser && !filtered.some(u => u.id === editingUser.id)) {
            filtered.push(editingUser);
          }
          setSelectedCollaborator(collaboratorToEdit.userId);
          setRol(collaboratorToEdit.rol);
        }
        setCollaborators(filtered);
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
        userId: selectedCollaborator,
        rol: rol
      };
      if (mode === 'edit') {
        console.log(collaboratorToEdit)
        await collaboratorService.patchCollaborator(collaboratorToEdit.user.id, payload);
      } else {
        await agendaService.postCollaboratorToAgenda(agendaId, payload);
      }

      onHide();
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onHide();
  };

  useEffect(()=>{console.log(collaboratorToEdit)},[collaboratorToEdit])

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center m-4 space-x-4">
          <h2 className="text-lg font-semibold">Agregar colaborador</h2>
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
                options={collaborators}
                onChange={(e) => setSelectedCollaborator(e.value)}
                optionLabel="name" 
                optionValue="id"
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
                label="Agregar colaborador"
                onClick={handleSubmit}
                disabled={!selectedCollaborator}
                className={`px-4 py-1 text-sm rounded-md font-medium text-white transition border ${
                  !selectedCollaborator
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

export default CollaboratorDialog;
