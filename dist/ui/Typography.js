import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const H1 = ({ className, children }) => {
    return (_jsx("h1", { className: `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`, children: children }));
};
const H2 = ({ className, children }) => {
    return (_jsx("h2", { className: `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`, children: children }));
};
const H3 = ({ className, children }) => {
    return (_jsx("h3", { className: `scroll-m-20 text-2xl font-semibold tracking-tight ${className}`, children: children }));
};
const H4 = ({ className, children }) => {
    return (_jsx("h4", { className: `scroll-m-20 text-xl font-semibold tracking-tight ${className}`, children: children }));
};
const P = ({ className, children }) => {
    return (_jsx("p", { className: `leading-7 [&:not(:first-child)]:mt-6 ${className}`, children: children }));
};
const Blockquote = ({ className, children }) => {
    return (_jsx("blockquote", { className: `mt-6 border-l-2 pl-6 italic ${className}`, children: children }));
};
const InlineCode = ({ className, children }) => {
    return (_jsx("code", { className: `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`, children: children }));
};
const Lead = ({ className, children }) => {
    return (_jsx("p", { className: `text-xl text-muted-foreground ${className}`, children: children }));
};
const Large = ({ className, children }) => {
    return _jsx("div", { className: `text-lg font-semibold ${className}`, children: children });
};
const Muted = ({ className, children }) => {
    return (_jsxs("p", { className: `text-sm text-muted-foreground ${className}`, children: [children, "."] }));
};
export { H1, H2, H3, H4, P, Lead, Large, Muted, Blockquote, InlineCode };
