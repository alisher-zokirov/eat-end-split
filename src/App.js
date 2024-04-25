import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Fazliddin",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sharofat",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Alisher",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

const App = () => {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleSHowAddFriend(){
    setShowAddFriend((show) => !show)
  }

  function handleAddFriend(friend){
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelection(friend){
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value){
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
        ? {...friend, balance: friend.balance + value}
        : friend
        )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelection}/>
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
        <Button onClick={handleSHowAddFriend}>{showAddFriend ? "Yopish" : "Do'st qo'shish"}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>
  );
};

function FriendList({friends, onSelection, selectedFriend}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          Siz qarzdorsiz {friend.name}dan ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name}sizdan qarzdor ${friend.balance}
        </p>
      )}

      {friend.balance === 0 && (
        <p>
          Siz va {friend.name} rachchotsizlar
        </p>
      )}

      <Button onClick={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSumbit(e){
    e.preventDefault()

    if(!name || !image) return;

    const id = crypto.randomUUID()

    const newFriend ={
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    } 

    onAddFriend(newFriend);

    setName('')
    setImage("https://i.pravatar.cc/48")
  }

  return(
    <form className="form-add-friend" onSubmit={handleSumbit}>
      <label htmlFor="">👦 Do'stingni ismi</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

      <label htmlFor="">🖼️ Do'stingni rasmi</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/> 

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}){
  const [bill, setBill] = useState("")
  const [paidByUSer, setPaidByUSer] = useState("")
  const paidByFriend = bill ? bill - paidByUSer : "";
  const [WhoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmit(e){
    e.preventDefault();

    if (!bill || !paidByUSer) return;
    onSplitBill(WhoIsPaying === "user" ? -paidByFriend : paidByUSer);
  }

  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>To'lovni bo'lish {selectedFriend.name} bilan</h2>

      <label>💸 To'lovni qiymati</label>
      <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

      <label>💰 Sizni xaqqiz</label>
      <input type="text" value={paidByUSer} onChange={(e)=>setPaidByUSer(Number(e.target.value) > bill ? paidByUSer : Number(e.target.value))} />

      <label>🤑 {selectedFriend.name} ni haqqi</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>🪙 Kim to'laydi</label>
        <select value={WhoIsPaying} onChange={(e)=> setWhoIsPaying(e.target.value)}>
          <option value="user">Siz</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>

        <Button>To'lovni bo'lish</Button>
    </form>
  )
}

export default App;