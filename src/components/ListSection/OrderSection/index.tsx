import React, { useEffect, useState } from "react";
import FormModal from "../../FormModal";
import ListSectionHeader from "../../ListSectionHeader";
import { OrderData } from "../../../type";
import { deletarPedido, listarPPedidos } from "../../../services/MainApi/pedidos";
import TableOrder from "../../Table/TableOrder";

export interface Column {
  key: keyof OrderData;
  label: string;
}

interface ListSectionProps {
  title: string;
  columns: Column[];
}

const OrderSection: React.FC<ListSectionProps> = ({ title, columns }) => {
  const [data, setData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchListData() {
      try {
        const response = await listarPPedidos();
        setData(response.data.result || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da lista:", error);
      }
    }

    fetchListData();
  }, []);

  const handleEdit = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Tem certeza que deseja deletar?");
    if (confirmed) {
      deletarPedido(id);
    }
  };

  const handleAddUser = () => {
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const fields = [
    { label: "Nome", name: "title", type: "text", required: true },
    { label: "Descrição", name: "description", type: "text", required: true },
    { label: "Publicado", name: "published", type: "checkbox", required: true },
  ];

  return (
    <div>
      <ListSectionHeader title={title} onAddItem={handleAddUser} />
      {loading && <div>Carregando...</div>}
      {!loading && data.length === 0 && <div>Nenhum usuário encontrado.</div>}
      {!loading && data.length > 0 && (
        <>
          <TableOrder
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {isModalOpen && (
            <div className="modal" onClick={handleOutsideClick}>
              <div className="modal-content">
                <FormModal
                  onClose={handleCloseModal}
                  userId={selectedUserId}
                  fields={fields}
                  title={title}
                />
              </div>
            </div>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <FormModal
              onClose={handleCloseModal}
              userId={selectedUserId}
              fields={fields}
              title={title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSection;
