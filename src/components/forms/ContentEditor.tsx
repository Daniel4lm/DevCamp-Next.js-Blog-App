import hljs from "highlight.js/lib/common";
import 'highlight.js/styles/github-dark.css'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import ReactQuill, { Quill } from 'react-quill'

hljs.configure({
    languages: ['javascript', 'java', 'css', 'php', 'go']
})

ReactQuill.Quill.register('modules/wordcounter', function (quill: any, options: any) {
    let container = document.querySelector('#ql-counter')
    quill.on('text-change', function () {
        let text = quill.getText()
        let wordCount = text.split(/\s+/).filter(Boolean).length + ' words'
        let characterCount = text.length + ' characters'
        // if (options.unit === 'word') {
        //     wordCount = text.split(/\s+/).filter(Boolean).length + ' words'
        // } else {
        //     wordCount = text.length + ' characters'
        // }
        if (container) container.innerHTML = `${wordCount}, ${characterCount}`
    })
})

function insertHeart(this: { quill: any; insertHeart: () => void; linkac: (value: string) => void; }) {
    const cursorPosition = this.quill.getSelection().index;

    var href = prompt('Enter the fragment:')
    //this.quill.setSelection(cursorPosition + 1)

    if (href) {
        this.quill.insertText(cursorPosition, '#', 'link', `#${href}`)
        //this.quill.formatText(cursorPosition, 1, 'target', '_self');
    } else {
        return
    }
}

var Link = Quill.import('formats/link');

class MyLink extends Link {
    static create(value: string) {
        let node = Link.create(value);
        value = Link.sanitize(value);
        node.setAttribute('href', value);
        if (value.startsWith("#")) {
            node.removeAttribute('target');
            node.setAttribute('id', value.replace('#', ''));
            node.className = 'text-link'
        } else {
            node.setAttribute("target", "_blank");
        }
        return node;
    }

    format(name: string, value: string) {
        super.format(name, value);

        if (name !== this.statics.blotName || !value) {
            return;
        }

        if (value.startsWith("#")) {
            this.domNode.removeAttribute("target");
            this.domNode.setAttribute('id', value.replace('#', ''));
            this.domNode.className = 'text-link'
        } else {
            this.domNode.setAttribute("target", "_blank");
        }
    }
}

MyLink.blotName = 'link';
MyLink.tagName = 'a';

Quill.register(MyLink);

// let Inline = Quill.import('blots/inline');

// class LinkBlot extends Inline {
//     static create(value: string) {
//         let node = super.create();
//         // Sanitize url value if desired
//         node.setAttribute('href', value);
//         // Okay to set other non-format related attributes
//         // These are invisible to Parchment so must be static
//         //node.setAttribute('target', '_blank');
//         node.removeAttribute('target');
//         return node;
//     }

//     static formats(node: HTMLLinkElement) {
//         // We will only be called with a node already
//         // determined to be a Link blot, so we do
//         // not need to check ourselves
//         return node.getAttribute('href');
//     }
// }
// LinkBlot.blotName = 'linkac';
// LinkBlot.tagName = 'a';

// Quill.register(LinkBlot);

const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path
            className="ql-stroke"
            d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
        />
    </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path
            className="ql-stroke"
            d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
        />
    </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange(this: { quill: any; history: any; undo: () => void; }) {
    this.quill.history.undo();
}
function redoChange(this: { quill: any; history: any; undo: () => void; }) {
    this.quill.history.redo();
}

// Quill Toolbar component
export const QuillToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-font" defaultValue="arial">
                <option value="arial">Arial</option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select>
            <select className="ql-size" defaultValue="medium">
                <option value="extra-small">Size 1</option>
                <option value="small">Size 2</option>
                <option value="medium">Size 3</option>
                <option value="large">Size 4</option>
            </select>
            <select className="ql-header" defaultValue="3">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="3">Normal</option>
                <option value="4">Heading-4</option>
                <option value="5">Heading-5</option>
                <option value="6">Heading-6</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-direction" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
        <span className="ql-formats">
            <button className="ql-formula" />
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <CustomUndo />
            </button>
            <button className="ql-redo">
                <CustomRedo />
            </button>
            <button className="ql-clean" />
            <button className="ql-insertHeart" />
        </span>
    </div>
);

const quillPostModules = {
    toolbar: {
        container: "#toolbar",
        // container: [
        //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        //     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        //     [{ 'font': [] }],
        //     [{ 'align': [] }],
        //     ['bold', 'italic', 'underline', 'strike'],
        //     ['blockquote', 'code-block'],
        //     [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        //     ['link', 'image', 'video'],
        //     ['clean'], ['insertHeart']
        // ],
        handlers: {
            insertHeart: insertHeart,
            undo: undoChange,
            redo: redoChange,
            exampleName: function (value: string) {
                if (value) {
                    // ...
                }
            }
        },
    },
    syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value
    },
    wordcounter: true
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
            <QuillToolbar />
            <ReactQuill
                id="body-content"
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
