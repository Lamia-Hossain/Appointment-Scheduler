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
    <div className="z-[9999] fixed inset-0 flex items-center justify-center w-3/4 mx-auto">
      <div
        className="bg-black bg-opacity-50 fixed iAVnset-0"
        onClick={onClose}
      />
      <Slide direction="up" duration={500}>
        <div className="bg-white rounded-md z-20 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-5 justify-between">
            <p className="text-2xl text-[#255957] font-bold">{title}</p>
            <CloseOutlined
              onClick={onClose}
              className={`hover:cursor-pointer hover:bg-[#255957] w-8 h-8 hover:text-white rounded-full p-[1px]`}
            />
          </div>
          {children}
        </div>
      </Slide>
    </div>
  );
};

export default GeneralModal;
