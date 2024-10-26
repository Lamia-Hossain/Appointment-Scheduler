import React, { ReactNode } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Slide } from "react-awesome-reveal";

interface GeneralModalProps {
  children: ReactNode; // Children can be any valid React node
  onClose: () => void; // Function to handle closing the modal
  title: string; // Title of the modal
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  children,
  onClose,
  title,
}) => {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center w-3/4 mx-auto">
      <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose} />
      <Slide direction="up" duration={500}>
        <div className="bg-white text-black rounded-md shadow-md z-20 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-5 justify-between">
            <p className="text-2xl text-[#9974ad] font-bold">{title}</p>
            <CloseOutlined
              onClick={onClose}
              className={`hover:cursor-pointer hover:bg-[#9974ad] hover:text-white rounded-full p-1`}
            />
          </div>
          {children}
        </div>
      </Slide>
    </div>
  );
};

export default GeneralModal;
