import{j as r}from"./jsx-runtime-CDt2p4po.js";import{S as f}from"./index-BKGh1TIg.js";import{c as t}from"./utils-CytzSlOG.js";import{C as x}from"./chevron-right-IbxXp0b_.js";import"./index-GiUgBvb1.js";import"./createLucideIcon-xIukErcz.js";function c({...e}){return r.jsx("nav",{"aria-label":"breadcrumb","data-slot":"breadcrumb",...e})}function b({className:e,...a}){return r.jsx("ol",{"data-slot":"breadcrumb-list",className:t("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",e),...a})}function s({className:e,...a}){return r.jsx("li",{"data-slot":"breadcrumb-item",className:t("inline-flex items-center gap-1.5",e),...a})}function o({asChild:e,className:a,...d}){const B=e?f:"a";return r.jsx(B,{"data-slot":"breadcrumb-link",className:t("hover:text-foreground transition-colors",a),...d})}function p({className:e,...a}){return r.jsx("span",{"data-slot":"breadcrumb-page",role:"link","aria-disabled":"true","aria-current":"page",className:t("text-foreground font-normal",e),...a})}function m({children:e,className:a,...d}){return r.jsx("li",{"data-slot":"breadcrumb-separator",role:"presentation","aria-hidden":"true",className:t("[&>svg]:size-3.5",a),...d,children:e??r.jsx(x,{})})}c.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb"};b.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};s.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};o.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};m.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};const L={title:"UI/Breadcrumb",component:c},n={render:()=>r.jsx(c,{children:r.jsxs(b,{children:[r.jsx(s,{children:r.jsx(o,{href:"#",children:"Home"})}),r.jsx(m,{}),r.jsx(s,{children:r.jsx(o,{href:"#",children:"Settings"})}),r.jsx(m,{}),r.jsx(s,{children:r.jsx(p,{children:"Profile"})})]})})};var i,u,l;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...(l=(u=n.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const k=["Basic"];export{n as Basic,k as __namedExportsOrder,L as default};
