import React from "react";
import PropTypes from "prop-types";
import { storiesOf } from "@storybook/react";

import Component from "../Editor";

export default () => {

  class NodeEditor extends React.PureComponent {

    static propTypes = {
      appearance: Component.propTypes.appearance,
      theme: PropTypes.any
    }

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
     const { data } = this.state;
     this.setState({
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
     });
   }

   render() {
     const { appearance, theme } = this.props;
     const { data, nodeTypes } = this.state;
     return (
       <Component
         appearance={appearance}
         data={data}
         nodeTypes={nodeTypes}
         onConnect={this.handleConnect.bind(this)}
         onEdgeClick={(e, d) => console.log("edgeClick", d)}
         onNodeDrag={(e, a) => this.handleNodeMove(a)}
         onHandleClick={(e, d) => console.log("handleClick", d)}
         theme={theme} />
     );
   }

  }

  storiesOf("Editor", module)
    .addWithJSX("default", () => (
      <NodeEditor />
    ))
    .addWithJSX("themed", () => (
      <NodeEditor
        appearance={{
          edgeStrokeColor: "#01DAA9",
          edgeStrokeWidth: 3,
          gridBackgroundColor: "#2B2A2F",
          gridType: "line",
        }}
        theme={{
          handle: {
            display: "inline-block",
            width: "18px",
            height: "18px",
            background: "#2B2A2F",
            borderRadius: "50%",
            border: "1px solid #01DAA9",
            boxSizing: "border-box"
          },
          inputHandle: {
            position: "absolute",
            left: "-10px",
            top: "50%",
            marginTop: "-10px"
          },
          outputHandle: {
            position: "absolute",
            right: "-10px",
            top: "50%",
            marginTop: "-10px"
          },
          connectedHandle: {
            background: "#01DAA9",
            border: "4px solid #2B2A2F"
          },
          attribute: {
            padding: "10px 20px",
            position: "relative",
            minWidth: "100px"
          },
          node: {
            display: "inline-block",
            border: "2px solid #01DAA9",
            borderRadius: "5px",
            color: "#fff",
            background: "#2B2A2F",
            fontSize: "12px"
          }
        }} />
    ));

};
