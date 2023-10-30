import React, { KeyboardEvent, MouseEvent, useRef } from 'react'
import { CloseIcon } from '../Icons'

function MultiTagSelect({ propTags = [], handleTags }: { propTags: string[], handleTags: (val: string[]) => void }) {

    const inpuRef = useRef<HTMLInputElement>(null)

    function removeTopic(event: MouseEvent<HTMLDivElement>): void {
        const item = event.currentTarget.dataset.remove
        handleTags(propTags.filter(tag => tag !== item))
    }

    function handleTagInput(event: KeyboardEvent<HTMLInputElement>) {
        event.stopPropagation()
        const inputValue = event.currentTarget.value.trim().replaceAll(/[#,\s+]/gi, '')
        if (['Tab', 'Space', 'Enter', 'NumpadEnter', 'Comma'].includes(event.code)) {
            if (inputValue.length && inputValue.length >= 2) {
                const updatedTags = [...propTags, inputValue].reduce(
                    (unique: string[], inputValue) => (unique.includes(inputValue) ? unique : [...unique, inputValue]),
                    [],
                )
                handleTags(updatedTags)
                inpuRef.current!.value = ''
            }
            event.preventDefault()
        }
    }

    return (
        <div className="flex flex-wrap border duration-500 border-[#5C5C5CB2] dark:bg-[#4a5469] dark:text-slate-100 dark:border-slate-400 focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-blue-400 dark:focus-within:border-transparent ring-opacity-90 focus-within:border-transparent overflow-hidden rounded-md bg-white">
            <div className="flex items-center flex-wrap flex-1 dark:bg-[#4a5469]">
                {
                    propTags.map(topic => (
                        <div
                            id={`post-topic-${topic}`}
                            key={`post-topic-${topic}`}
                            data-test='post-topic-item'
                            className="flex justify-center items-center rounded-lg text-sm md:text-base text-gray-800 text-center bg-slate-200 dark:bg-slate-300 p-2 m-1"
                        >
                            {`#${topic}`}
                            <div
                                id={`remove-topic-${topic}`}
                                data-remove={topic}
                                onClick={removeTopic}
                                data-testid={`remove-topic-${topic}`}
                                className="w-4 h-4 cursor-pointer ml-2 rounded-full flex justify-center items-center
                                    hover:transition-all hover:duration-[600] hover:ease-in-out text-gray-500 hover:text-red-600"
                            >
                                <CloseIcon />
                            </div>
                        </div>
                    ))
                }

                <input
                    id='tags'
                    name='tags'
                    type='text'
                    ref={inpuRef}
                    className={'flex-1 px-2 py-3 border-0 dark:bg-[#4a5469] placeholder-gray-500 dark:placeholder-slate-400 outline-none focus:ring-0 text-sm md:text-base'}
                    onKeyDown={handleTagInput}
                />
            </div>
        </div >
    )
}

export default MultiTagSelect