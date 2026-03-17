'use client';
import {
    cloneElement,
    createContext,
    type ReactElement,
    type ReactNode,
    useContext,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

type ModalContextType = {
    openName: string;
    close: () => void;
    open: (name: string) => void;
};

type ModalProps = {
    children: ReactNode;
};
type ModalWindowProps = {
    children: ReactElement<ClickableProps>;
    name: string;
};
type ClickableProps = {
    onClick?: (e: React.MouseEvent) => void;
    onCloseModal?: () => void;
};
const ModalContext = createContext<ModalContextType | null>(null);

function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a <Modal>');
    }
    return context;
}
function Modal({ children }: ModalProps) {
    const [openName, setOpenName] = useState('');

    const close = () => setOpenName('');
    const open = (name: string) => setOpenName(name);

    return (
        <ModalContext.Provider value={{ openName, close, open }}>
            {children}
        </ModalContext.Provider>
    );
}

type OpenProps = {
    children: ReactElement<ClickableProps>;
    opens: string;
};
function Open({ children, opens: opensWindowName }: OpenProps) {
    const { open } = useModal();
    return cloneElement(children, {
        onClick: () => {
            open(opensWindowName);
        },
    });
}

function Window({ children, name }: ModalWindowProps) {
    const { openName, close } = useModal();
    if (name !== openName) return null;
    return createPortal(
        // {overlay }
        <div className="fixed inset-0 bg-backdrop z-1000 flex items-center justify-center p-4">
            <div className="relative flex flex-col bg-dropdown-background w-full max-w-150 h-[80vh] rounded-xl shadow-lg overflow-hidden">
                <button
                    className="absolute top-4 right-3 p-1 rounded-md hover:bg-hover transition cursor-pointer"
                    onClick={close}
                >
                    <HiXMark size={22} />
                </button>

                {cloneElement(children, {
                    onCloseModal: close,
                })}
            </div>
        </div>,
        document.body,
    );
}

//   transform shadow-lg px-16 py-12 transition-all duration-500 bg
Modal.Open = Open;
Modal.Window = Window;
export default Modal;
