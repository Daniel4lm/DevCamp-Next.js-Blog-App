import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultiTagSelect from '../forms/MultiTagSelect';


describe('MultiTag component', () => {

    it('should receive user input, create and show new tags', async () => {
        let tagsList: string[] = [];

        const handleTagsFn = jest.fn((list: string[]) => {
            tagsList = list
        });

        const { rerender } = render(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        const tagsInput = screen.getByRole('textbox')
        await userEvent.type(tagsInput, 'next.js,')
        fireEvent.keyDown(tagsInput, { key: 'Enter', code: 'Enter' })
        rerender(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        await userEvent.type(tagsInput, '#testing ')
        fireEvent.keyDown(tagsInput, { key: 'Space', code: 'Space' })
        rerender(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        await userEvent.type(tagsInput, '#')
        fireEvent.keyDown(tagsInput, { key: 'Space', code: 'Space' })
        await userEvent.type(tagsInput, 'react')
        await userEvent.tab()

        rerender(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        await userEvent.type(tagsInput, 'react')
        fireEvent.keyDown(tagsInput, { key: 'Space', code: 'Space' })
        await userEvent.type(tagsInput, 'react')
        await userEvent.tab()

        rerender(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        expect(screen.getByText(/#next.js/i)).toBeInTheDocument()
        expect(screen.getByText(/#testing/i)).toBeInTheDocument()
        expect(screen.getByText(/#react/i)).toBeInTheDocument()

        expect(screen.getAllByText(/#/i)).toHaveLength(3)
    })

    it('should receive tags and remove tags on user input', async () => {
        let tagsList: string[] = ['react', 'next.js', 'testing'];

        const handleTagsFn = jest.fn((list: string[]) => {
            tagsList = list
        });

        const { rerender } = render(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        expect(screen.getByText(/#next.js/i)).toBeInTheDocument()
        expect(screen.getByText(/#testing/i)).toBeInTheDocument()
        expect(screen.getByText(/#react/i)).toBeInTheDocument()

        const deleteBtn = screen.getByTestId(`remove-topic-react`)
        await userEvent.click(deleteBtn)

        rerender(<MultiTagSelect propTags={tagsList} handleTags={handleTagsFn} />)

        expect(screen.queryByText(/#react/i)).not.toBeInTheDocument()
        expect(screen.getAllByText(/#/i)).toHaveLength(2)
    })
})
