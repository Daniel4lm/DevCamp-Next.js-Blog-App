
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Modal from '../Modal'

describe('Modal test', () => {

    const handleClose = jest.fn()

    it('modal should not be rendered', () => {
        render(
            <Modal
                isOpen={false}
                onClose={handleClose}
                type="DIALOG"
            >
                <p className="mx-auto font-light text-gray-600 dark:text-inherit py-2">
                    Welcome to modal dialog
                </p>
            </Modal>
        )
        expect(screen.queryByText(/Welcome to modal dialog/i)).not.toBeInTheDocument()
    })

    it('modal shows with content and close button', () => {

        let modalState = true;

        const setModalState = jest.fn(() => {
            modalState = !modalState
        });

        const { rerender } = render(
            <Modal
                isOpen={modalState}
                onClose={setModalState as any}
                title="Modal dialog"
                type="DIALOG"
            >
                <p>Welcome to modal dialog</p>
                <button onClick={setModalState}>Cancel modal</button>
            </Modal>
        )

        expect(screen.getByText(/Welcome to modal dialog/i)).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: /Cancel modal/i }))
        expect(setModalState).toHaveBeenCalledTimes(1)

        rerender(
            <Modal
                isOpen={modalState}
                onClose={setModalState as any}
                title="Modal dialog"
                type="DIALOG"
            >
                <p>Welcome to modal dialog</p>
                <button onClick={setModalState}>Cancel modal</button>
            </Modal>
        )

        expect(screen.queryByText(/Welcome to modal dialog/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Cancel modal/i })).not.toBeInTheDocument()

        modalState = true

        rerender(
            <Modal
                isOpen={modalState}
                onClose={setModalState as any}
                title="Modal dialog"
                type="INFO"
            >
                <p>Welcome to info modal</p>
            </Modal>
        )

        expect(screen.getByText(/Welcome to info modal/i)).toBeInTheDocument()
        fireEvent.click(screen.getByTitle('close-modal'))
        expect(setModalState).toHaveBeenCalledTimes(2)
    })
})