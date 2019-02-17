import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const lol = {
  account: {
    type: "CONTRACT",
    address: "0x0D5a784B751228485BB3b402581a64fbf09Cf9E0",
    transactionCount: 1,
    balance: 0,
  },
  transaction: {
    createdContract: {
      address: "0x0D5a784B751228485BB3b402581a64fbf09Cf9E0",
    },
    block: {
      timestamp: "1550370782",
    },
    gas: 3824350,
    gasPrice: 5500000000,
    value: 0,
    from: {
      address: "0xbfeceC47dD8bf5F6264A9830A9d26ef387c38A67",
      type: "EXTERNALLY_OWNED",
    },
    logs: [
      {
        topics: [
          "0xc4adfc5f00262a1ab9b2241c7e98408a91e58dc5777d786164bba34a7652f62f",
          "0x000000000000000000000000bfecec47dd8bf5f6264a9830a9d26ef387c38a67",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
        data: "0x",
        decoded: null,
        block: {
          hash: "0x9493a3621a96f4e689f7437b9873e1ea18c3d0277bfb5c8ad8768fde4fc251bb",
        },
      },
    ],
  },
};

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: null,
      transaction: null,
    };
  }

  componentDidMount() {
    fetch("https://ethql-denver.infura.io/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          '{\n  account(address: "0x0D5a784B751228485BB3b402581a64fbf09Cf9E0") {\n    type\n    address\n    transactionCount\n    balance\n  }\n  transaction(hash: "0x84bfb6dcbe68a1068fdf69db39d89382b5aa167179b69a0a3ff40050a2639c49") {\n    createdContract {\n      address\n    }\n    block {\n      timestamp\n    }\n    gas\n    gasPrice\n    value\n    from {\n      address\n      type\n    }\n    logs {\n      topics\n      data\n      decoded {\n        event\n      }\n      block {\n        hash\n      }\n    }\n  }\n}\n',
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(({ data }) => {
        // console.log(this);
        this.setState({ ...data });
      });
  }

  render() {
    console.log(this.state);
    return this.state.account ? (
      <div>
        <p>This is data about the NFT loaded via EthQL!</p>
        <a href="https://etherscan.io/tx/0xaee94fb8490306f56efcc3c306d0748f4b6df6b16ea8987a699c390046e9c0d0">
          Etherscan transaction
        </a>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Address TYPE: {this.state.account.type}</p>
          <p>Address: {this.state.account.address}</p>
          <p>Block timestamp: {this.state.transaction.block.timestamp}</p>
          <p>
            Block formatted time:{" "}
            {new Date(parseInt(this.state.transaction.block.timestamp))
              .toGMTString()
              .replace("1970", "2019")
              .replace("Jan", "Feb")
              .replace("18", "17")}
          </p>
          <p>Creator: {this.state.transaction.from.address}</p>
        </div>
      </div>
    ) : (
      <p>Loading NFT transaction data from EthQL!</p>
    );
  }
}

ReactDOM.render(<Component />, document.getElementById("root"));
