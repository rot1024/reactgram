import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Editor";

export default () => {

  class NodeEditor extends React.PureComponent {

   state = {
     data: {
       nodes: [
         {
           id: "x",
           type: "a",
           x: 100,
           y: 100,
           data: {}
         },
         {
           id: "y",
           type: "b",
           x: 300,
           y: 200,
           data: {}
         }
       ],
       edges: [
         {
           from: {
             node: "x",
             attribute: ""
           },
           to: {
             node: "y",
             attribute: ""
           }
         }
       ]
     },
     nodeTypes: {
       a: {
         data: {
           titile: "Node A"
         },
         input: true,
         output: true,
         attributes: [
           { id: "attr", children: "attr" }
         ]
       },
       b: {
         data: {
           titile: "Node B"
         },
         input: true,
         output: false,
         attributes: [
           { id: "out", output: true, children: "out" }
         ]
       }
     }
   }

   handleConnect({ from, to }) {
     this.setState(({ data }) => (
       data.edges.some(e => e.from.node === from.node &&
         e.from.attribute === from.attribute &&
         e.to.node === to.node &&
         e.to.attribute === to.attribute)
     ) ? console.warn("the edge already exists", { from, to }) || {} :
       console.log("new edge is created!", { from, to }) || {
         data: {
           ...data,
           edges: [
             ...data.edges,
             {
               from: { node: from.node, attribute: from.attribute },
               to: { node: to.node, attribute: to.attribute }
             }
           ]
         }
       });
   }

   handleNodeMove({ index, x, y }) {
     this.setState(({ data }) => ({
       data: {
         ...data,
         nodes: [
           ...data.nodes.slice(0, index),
           ...[{
             ...data.nodes[index],
             x,
             y
           }],
           ...data.nodes.slice(index + 1)
         ]
       }
     }));
   }

   render() {
     const { data, nodeTypes } = this.state;
     return (
       <Component
         data={data}
         nodeTypes={nodeTypes}
         onConnect={this.handleConnect.bind(this)}
         onEdgeClick={(e, d) => console.log("edgeClick", d)}
         onNodeDrag={a => this.handleNodeMove(a)}
         onHandleClick={(e, d) => console.log("handleClick", d)} />
     );
   }

  }

  storiesOf("Editor", module)
    .addWithJSX("default", () => (
      <NodeEditor />
    ));

};
