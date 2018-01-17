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
           input: {
             node: "x",
             attribute: ""
           },
           output: {
             node: "y",
             attribute: ""
           }
         }
       ]
     },
     nodeTypes: {
       a: {
         titile: "Node A",
         input: true,
         output: true,
         attributes: [
           { id: "attr", children: "attr" }
         ]
       },
       b: {
         title: "Node B",
         input: true,
         output: false,
         attributes: [
           { id: "out", output: true, children: "out" }
         ]
       }
     }
   }

   handleConnect({ input, output }) {
     this.setState(({ data }) => (
       data.edges.some(e => e.input.node === input.node &&
         e.input.attribute === input.attribute &&
         e.output.node === output.node &&
         e.output.attribute === output.attribute)
     ) ? console.log("the edge already exists", { input, output }) || {} :
       console.log("new edge is created!", { input, output }) || {
         data: {
           ...data,
           edges: [
             ...data.edges,
             {
               input: { node: input.node, attribute: input.attribute },
               output: { node: output.node, attribute: output.attribute }
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
         onNodeDragEnd={a => this.handleNodeMove(a)} />
     );
   }

  }

  storiesOf("Editor", module)
    .addWithJSX("default", () => (
      <NodeEditor />
    ));

};
