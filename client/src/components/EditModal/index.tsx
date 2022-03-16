import './styles.scss';

import { useEffect, useState } from 'react';

interface Iprops {
  showModal: boolean;
}
export default function EditModal({ showModal }: Iprops) {
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    showModal && setReveal(true);
  }, [showModal]);
  const modalStyles = `edit-modal${reveal ? ' reveal' : ''}`;

  return (
    <div className={`edit-modal-container${showModal ? ' show' : ''}`}>
      <div className="overlay"></div>
      <div className={modalStyles}>
        <h1>Edit user</h1>
      </div>
    </div>
  );
}
