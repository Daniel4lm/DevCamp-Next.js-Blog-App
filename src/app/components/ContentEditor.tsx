import hljs from "highlight.js/lib/common";
import 'highlight.js/styles/github-dark.css'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

hljs.configure({
    languages: ['javascript', 'java', 'css', 'php', 'go']
})

const quillPostModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value
    }
    // toolbar: {
    //     container: "#toolbar",
    // },
}

const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block"
]

interface EditorProps {
    value: string
    placeholder?: string
    onValueChange: (val: string) => void
    handleFieldValidation?: () => void
}

const ContentEditor = (props: EditorProps) => {
    return (
        <>
            <ReactQuill
                theme="snow"
                modules={quillPostModules}
                formats={quillFormats}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onValueChange}
                onBlur={props.handleFieldValidation}
            />
        </>
    )
}

export default ContentEditor
