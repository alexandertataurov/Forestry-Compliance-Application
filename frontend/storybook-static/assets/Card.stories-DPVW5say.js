import{j as r}from"./jsx-runtime-CDt2p4po.js";import{c as a}from"./utils-CytzSlOG.js";import"./index-GiUgBvb1.js";function o({className:e,...t}){return r.jsx("div",{"data-slot":"card",className:a("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",e),...t})}function c({className:e,...t}){return r.jsx("div",{"data-slot":"card-header",className:a("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",e),...t})}function l({className:e,...t}){return r.jsx("h4",{"data-slot":"card-title",className:a("leading-none",e),...t})}function p({className:e,...t}){return r.jsx("p",{"data-slot":"card-description",className:a("text-muted-foreground",e),...t})}function m({className:e,...t}){return r.jsx("div",{"data-slot":"card-content",className:a("px-6 [&:last-child]:pb-6",e),...t})}function C({className:e,...t}){return r.jsx("div",{"data-slot":"card-footer",className:a("flex items-center px-6 pb-6 [.border-t]:pt-6",e),...t})}o.__docgenInfo={description:"",methods:[],displayName:"Card"};c.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};C.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};l.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};p.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};m.__docgenInfo={description:"",methods:[],displayName:"CardContent"};const h={title:"UI/Card",component:o},d={render:()=>r.jsxs(o,{children:[r.jsxs(c,{children:[r.jsx(l,{children:"Card title"}),r.jsx(p,{children:"Card description"})]}),r.jsx(m,{children:r.jsx("p",{children:"Content goes here."})}),r.jsx(C,{children:"Footer"})]})};var n,s,i;d.parameters={...d.parameters,docs:{...(n=d.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <Card>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content goes here.</p>
      </CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
}`,...(i=(s=d.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const g=["Basic"];export{d as Basic,g as __namedExportsOrder,h as default};
