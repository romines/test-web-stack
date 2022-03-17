import './styles.scss';

import { useEffect, useState } from 'react';

interface Iprops {
  showModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}
export default function Modal({ showModal, closeModal, children }: Iprops) {
  // 'reveal' local state property used to animate modal
  //
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setReveal(!!showModal);
  }, [showModal]);
  const modalClassString = `edit-modal${reveal ? ' reveal' : ''}`;
  const animatedCloseModal = () => {
    setReveal(false);
    // timeout used to give animation some time to finish before closing modal
    setTimeout(() => closeModal(), 500);
  };

  return (
    <div className={`edit-modal-container${showModal ? ' show' : ''}`}>
      <div className="overlay" onClick={animatedCloseModal}></div>
      <div className={modalClassString}>{children}</div>
    </div>
  );
}
