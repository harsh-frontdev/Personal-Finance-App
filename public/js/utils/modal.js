/**
 * Initializes open/close functionality for a modal.
 * @param {string} modalId - The ID of the modal wrapper element.
 * @param {string} openBtnId - The ID of the button that opens the modal.
 * @param {string} closeBtnId - The ID of the button that closes the modal.
 */
export default function initModal(modalId, openBtnId, closeBtnId) {
  const modal = document.getElementById(modalId);
  const btnOpen = document.getElementById(openBtnId);
  const btnClose = document.getElementById(closeBtnId);

  if (!modal) return;

  const openModal = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', openModal);
  }

  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}
