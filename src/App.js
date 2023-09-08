import { useState } from "react"

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
]

const getBalanceInfo = ({ balance, name }) => {
  return balance > 0 
    ? { message: `${name} owes you ${balance}€`, color: 'green' }
    : balance < 0 
      ? { message: `You owe ${name} ${Math.abs(balance)}€`, color: 'red' }
      : { message: `You and ${name} are even` }
}

function Button ({ children, handler }) {
  return <button onClick={handler} className="button">{children}</button>
}

function FormAddFriend ({ handleAddFriend }) {
  function handleFormSubmit (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { name, image } = Object.fromEntries(formData)

    if (!name || !image) {
      return
    }

    const id = crypto.randomUUID()
    handleAddFriend({ id, name, image: `${image}?u=${id}`, balance: 0 })
  }

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>
        🤼 Friend name
        <input type="text" name="name" />
      </label>
      
      <label>
        📸 Image URL
        <input type="text" name="image" defaultValue={defaultUrl} />
      </label>

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill ({ selectedFriend }) {
  const [friendExpense, setFriendExpense] = useState(0)
  console.log('friendExpense:', friendExpense) // 👈🏻 retorna number!

  function handleSubmit (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { yourExpense, whoPays } = Object.fromEntries(formData)

    console.log(whoPays === 'You' ? `${selectedFriend.name} me deve ${friendExpense}` : `Devo ${yourExpense} para ${selectedFriend.name}`)
  }

  function handleOnChange (e) {
    const formData = new FormData(e.currentTarget)
    const { bill, yourExpense } = Object.fromEntries(formData)
    
    console.log('bill:', typeof bill) // 👈🏻 retorna string
    console.log('yourExpense:', typeof yourExpense) // 👈🏻 retorna string
    
    setFriendExpense(bill - yourExpense)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit} onChange={handleOnChange}>
      <h2>Split the Bill with {selectedFriend.name}</h2>

      <label>
        💰 Bill value
        <input name="bill" type="number" />
      </label>
      
      <label>
        🧘🏻‍♂️ Your expense
        <input name="yourExpense" type="number" />
      </label>
      
      <label>
        🧍🏻‍♂️ {selectedFriend.name}'s expense
        <input value={friendExpense} type="text" disabled />
      </label>
      
      <label>🤑 Who is paying the bill?</label>
      <select name="whoPays">
        <option value="You">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}

function ListOfFriends ({ friends, selectedFriend, handleClickSelect }) {
  return (
    <ul>
      {friends.map(friend => {
        const balanceInfo = getBalanceInfo({ balance: friend.balance, name: friend.name })
        const isSelectedFriend = friend.id === selectedFriend?.id

        return (
          <li key={friend.id} className={isSelectedFriend ? 'selected' : ''}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>
            <p className={balanceInfo?.color}>{balanceInfo.message}</p>
            <Button handler={() => handleClickSelect(friend)}>{isSelectedFriend ? 'Close' : 'Select'}</Button>
          </li>
        )
      })}
    </ul>
  )
}

const defaultUrl = `https://i.pravatar.cc/48`

export function App () {
  const [friends, setFriends] = useState(initialFriends)
  const [showFormAddFriend, setShowFormAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleClickAddFriend () {
    setShowFormAddFriend(showFormAddFriend => !showFormAddFriend)
  }

  function handleAddFriend (newFriend) {
    setFriends(prevFriends => [...prevFriends, newFriend])
    setShowFormAddFriend(false)
  }

  function handleClickSelect (clickedFriend) {
    setShowFormAddFriend(false)
    setSelectedFriend(prevFriend => {
      const friendIsAlreadySelected = prevFriend?.id === clickedFriend.id
      return friendIsAlreadySelected ? null : clickedFriend
    })
  }

  return (
    <div className="app">
      <div className="sidebar">
        <ListOfFriends friends={friends} selectedFriend={selectedFriend} handleClickSelect={handleClickSelect} />

        {showFormAddFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <Button handler={handleClickAddFriend}>
          {showFormAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  )
}
