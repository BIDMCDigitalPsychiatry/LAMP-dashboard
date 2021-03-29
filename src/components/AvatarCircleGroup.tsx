import * as React from "react"
import { Avatar, Menu, Tooltip, ButtonBase } from "@material-ui/core"
import clsx from "clsx"
import { Box, makeStyles, createStyles } from "@material-ui/core"

/*const createTestAccount = (id) => ({
  id,
  name: `${id}`,
  image: "/images/test.jpg",
})*/

export const useMenu = (): any => {
  const [anchor, setAnchor] = React.useState({ id: null, anchorEl: null })
  const handleOpen = React.useCallback((id, event) => setAnchor({ id, anchorEl: event.currentTarget }), [setAnchor])
  const handleClose = React.useCallback(() => setAnchor({ id: null, anchorEl: null }), [setAnchor])
  return [anchor, handleOpen, handleClose]
}

export const useAccounts = ({ accounts: Accounts = [], onDelete, onAdd }): any => {
  const [accounts, setAccounts] = React.useState(Accounts)

  const addAccount = React.useCallback(
    (account, index = accounts.length) => {
      setAccounts((prev) => {
        var next = [...prev]
        next.splice(index, 0, account)
        return next
      })
      onAdd && onAdd(account)
    },
    [accounts, setAccounts, onAdd]
  )

  const deleteAccount = React.useCallback(
    (id) => {
      setAccounts((prev) => [...prev].filter((a) => a.id !== id))
      onDelete && onDelete(id)
    },
    [setAccounts, onDelete]
  )
  return [accounts, addAccount, deleteAccount]
}

const useStyles = makeStyles(() =>
  createStyles({
    root: ({ diameter, avatarWidth }) => ({
      display: "flex",
      position: "relative",
      width: diameter,
      height: diameter,
      padding: avatarWidth / 2,
      borderRadius: "50%",
      margin: "auto",
    }),
    avatar: ({ avatarWidth }) => ({
      align: "center",
      height: avatarWidth,
      width: avatarWidth,
      margin: -(avatarWidth + 4) / 2,
      border: "solid 2px white",
    }),
    circle: ({ index, diameter, count }) => ({
      display: "block",
      position: "absolute",
      top: "50%; left: 50%",
      zIndex: 1,
      transform:
        index !== 0 &&
        `rotate(${index * (360 / count)}deg) translate(${diameter / 2}px) rotate(-${index * (360 / count)}deg)`,
    }),
    line: {
      borderTopColor: "lightgrey",
      borderTopStyle: "dashed",
      borderTopWidth: 3,
    },
    linePosition: ({ x0, y0, length, angle }) => ({
      position: "absolute",
      top: `${y0}px`,
      left: `${x0}px`,
      width: `${length}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0 0",
    }),
  } as any)
)

const OnCircle = ({ children, root, line, parent, avatarWidth, classes = {} as any, ...props }) => {
  const [ref, setRef] = React.useState(null)
  return (
    <>
      {line && (
        <Line
          from={root}
          to={ref}
          parent={parent}
          className={classes.line}
          count={props.count}
          avatarWidth={avatarWidth}
        />
      )}
      <div ref={(el) => setRef(el)} className={clsx(useStyles(props).circle, classes.circle)}>
        {children}
      </div>
    </>
  )
}

const defaultAnchor = { x: 0.5, y: 0.5 }

function parseAnchorPercent(value) {
  const percent = parseFloat(value) / 100
  if (isNaN(percent) || !isFinite(percent)) {
    throw new Error(`LinkTo could not parse percent value "${value}"`)
  }
  return percent
}

function parseAnchorText(value) {
  // Try to infer the relevant axis.
  switch (value) {
    case "top":
      return { y: 0 }
    case "left":
      return { x: 0 }
    case "middle":
      return { y: 0.5 }
    case "center":
      return { x: 0.5 }
    case "bottom":
      return { y: 1 }
    case "right":
      return { x: 1 }
  }
  return null
}

function parseAnchor(value) {
  if (!value) {
    return defaultAnchor
  }
  const parts = value.split(" ")
  if (parts.length > 2) {
    throw new Error('LinkTo anchor format is "<x> <y>"')
  }
  const [x, y] = parts
  return Object.assign(
    {},
    defaultAnchor,
    x ? parseAnchorText(x) || { x: parseAnchorPercent(x) } : {},
    y ? parseAnchorText(y) || { y: parseAnchorPercent(y) } : {}
  )
}

const Line = (props: any) => {
  const { from, to, fromAnchor = undefined, toAnchor = undefined, parent, count: Count, avatarWidth, className } = props

  const getCoordinates = React.useCallback(() => {
    if (!from || !to) {
      return false
    }

    const anchor0 = parseAnchor(fromAnchor)
    const anchor1 = parseAnchor(toAnchor)

    const box0 = from.getBoundingClientRect()
    const box1 = to.getBoundingClientRect()

    let offsetX = window.pageXOffset
    let offsetY = window.pageYOffset

    if (parent) {
      const boxp = parent.getBoundingClientRect()

      offsetX -= boxp.left + (window.pageXOffset || document.documentElement.scrollLeft)
      offsetY -= boxp.top + (window.pageYOffset || document.documentElement.scrollTop)
    }

    const x0 = box0.left + box0.width * anchor0.x + offsetX
    const x1 = box1.left + box1.width * anchor1.x + offsetX
    const y0 = box0.top + box0.height * anchor0.y + offsetY
    const y1 = box1.top + box1.height * anchor1.y + offsetY

    return { x0, y0, x1, y1 } as any
  }, [from, to, fromAnchor, toAnchor, parent])

  const [, setCount] = React.useState() // Needed to trigger re-render of lines on add/remove

  React.useEffect(() => {
    setCount(Count)
  }, [Count]) // Needed to trigger re-render of lines on add/remove

  const { x0, y0, x1, y1 } = getCoordinates()

  const dy = y1 - y0
  const dx = x1 - x0

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  const length = Math.sqrt(dx * dx + dy * dy) - avatarWidth / 2

  const classes = useStyles({ y0, x0, length, angle })
  return <Box className={clsx(classes.linePosition, classes.line, className)} />
}

const AvatarMesh = React.forwardRef(function AvatarMesh(
  { diameter, avatarWidth, lines, className, classes: Classes, children: childrenProp, ...other }: any,
  ref: any
) {
  const classes = useStyles({ diameter, avatarWidth })

  const children = React.Children.toArray(childrenProp).filter((child) => {
    /*if (isFragment(child)) {
      console.error(
        [
          "Material-UI: the AvatarMesh component doesn't accept a Fragment as a child.",
          "Consider providing an array instead.",
        ].join("\n")
      )
    }*/
    return React.isValidElement(child)
  })

  const [root, setRoot] = React.useState(null)
  const [parent, setParent] = React.useState(null)

  const handleSetRef = (el) => {
    ref && ref(el)
    setParent(el)
  }

  return (
    <Box className={clsx(classes.root, className)} ref={handleSetRef} {...other}>
      {children.map((c: any, i) => (
        <OnCircle
          key={i}
          diameter={diameter}
          index={i}
          count={children.length - 1}
          root={root}
          avatarWidth={avatarWidth}
          parent={parent}
          line={lines}
          classes={Classes}
        >
          {React.cloneElement(c, {
            ref: (el) => (i === 0 ? setRoot(el) : undefined),
            className: clsx(classes.avatar, c?.props.className),
            style: {
              zIndex: children.length - i,
              ...c.props.style,
            },
          })}
        </OnCircle>
      ))}
    </Box>
  )
})

export interface AvatarCircleGroupProps {
  diameter?: number
  avatarWidth?: number
  accounts: any[]
  lines?: boolean
  onAdd?: (account) => void
  onRemove?: (id) => void
  onResetPassword?: (id) => void
  classes?: object
}

export default function AvatarCircleGroup({
  diameter = 200,
  avatarWidth = 64,
  lines = true,
  accounts: Accounts = [],
  onAdd: OnAdd = undefined,
  onRemove = undefined,
  onResetPassword = undefined,
  classes = undefined,
}: AvatarCircleGroupProps) {
  // eslint-disable-next-line
  const [anchor, handleOpen, handleClose] = useMenu()
  /*const onAdd = React.useCallback(
    account => {
      OnAdd && OnAdd(account);
      handleClose();
    },
    [OnAdd, handleClose]
  );

  const onDelete = React.useCallback(
    id => {
      onRemove && onRemove(id);
      handleClose();
    },
    [onRemove, handleClose]
  );

  var [accounts, addAccount, deleteAccount] = useAccounts({
    accounts: Accounts, // Set initial accounts
    onDelete, // Callback fired on account delete
    onAdd // Callback fired on account add
  });

  const handleChangePassword = () => {
    onResetPassword && onResetPassword(anchor.id);
    handleClose();
  };

  const handleDelete = React.useCallback(() => deleteAccount(anchor.id), [
    anchor.id,
    deleteAccount
  ]);

  const id = Math.max(...[-1, ...accounts.map(a => a.id)]) + 1;
  const handleAdd = React.useCallback(
    (index = undefined) => addAccount(createTestAccount(id), index),
    [addAccount, id]
  );

  const handleClick = React.useCallback(
    ({ id, onClick }) => event => {
      id > 0 &&
        handleOpen(id, event);
      onClick &&
        onClick({ id, accounts, addAccount, deleteAccount, handleAdd });
    },
    [handleOpen, addAccount, deleteAccount, handleAdd, accounts]
  );*/
  let accounts = Accounts

  return (
    <>
      <AvatarMesh diameter={diameter} avatarWidth={avatarWidth} lines={lines} classes={classes}>
        {accounts.map(({ id, name, image, tooltip, onClick, ...other }, i) => (
          <Tooltip key={id} title={tooltip || ""}>
            <ButtonBase style={{ borderRadius: avatarWidth / 2 }} onClick={onClick}>
              <Avatar
                alt={name}
                src={image}
                {...other}
                style={{
                  ...(other.style || {}),
                  width: avatarWidth,
                  height: avatarWidth,
                  margin: -(avatarWidth + 4) / 2,
                }}
              />
            </ButtonBase>
          </Tooltip>
        ))}
      </AvatarMesh>
      <Menu anchorEl={anchor.anchorEl} keepMounted open={Boolean(anchor.anchorEl)} onClose={handleClose}>
        {/*<MenuItem onClick={() => handleAdd(accounts.findIndex(a => a.id === anchor.id))}>
          Add New ({id} at Index: {accounts.findIndex(a => a.id === anchor.id)})
        </MenuItem>*/}
        {/*<MenuItem onClick={handleDelete}>Delete</MenuItem>*/}
        {/*<MenuItem onClick={handleChangePassword}>Change Password</MenuItem>*/}
      </Menu>
    </>
  )
}
