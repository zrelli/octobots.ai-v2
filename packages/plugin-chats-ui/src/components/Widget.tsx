import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// erxes
import Icon from '@erxes/ui/src/components/Icon';
import { OverlayTrigger, Popover } from 'react-bootstrap';
// local
import ChatList from '../containers/chats/ChatList';
import WidgetChatWindow from '../containers/WidgetChatWindow';
import {
  WidgetButton,
  WidgetPopoverWrapper,
  WidgetPopoverSeeAll,
  WidgetChatWrapper
} from '../styles';
import Label from '@erxes/ui/src/components/Label';
import { IUser } from '@erxes/ui/src/auth/types';

const LOCALSTORAGE_KEY = 'erxes_active_chats';

type Props = {
  unreadCount: number;
  currentUser: IUser;
};

const Widget = (props: Props) => {
  const { unreadCount, currentUser } = props;

  const [activeChatIds, setActiveChatIds] = useState<any[]>(
    JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '[]')
  );

  const handleActive = (_chatId: string) => {
    if (checkActive(_chatId)) {
      updateActive(activeChatIds.filter(c => c !== _chatId));
    } else {
      updateActive([...activeChatIds, _chatId]);
    }
  };

  const updateActive = (_chats: any[]) => {
    setActiveChatIds(_chats);

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(_chats));
  };

  const checkActive = (_chatId: string) => {
    return activeChatIds.indexOf(_chatId) !== -1;
  };

  const popoverChat = (
    <Popover id="chat-popover" className="notification-popover">
      <WidgetPopoverWrapper>
        <ChatList
          isWidget={true}
          handleClickItem={_chatId => handleActive(_chatId)}
        />
      </WidgetPopoverWrapper>
      <WidgetPopoverSeeAll>
        <Link to="/erxes-plugin-chat">See all</Link>
      </WidgetPopoverSeeAll>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom"
        overlay={popoverChat}
      >
        <WidgetButton>
          <Icon icon="chat-1" size={20} />
          {unreadCount ? (
            <Label shake={true} lblStyle="danger" ignoreTrans={true}>
              {unreadCount}
            </Label>
          ) : (
            <></>
          )}
        </WidgetButton>
      </OverlayTrigger>
      <WidgetChatWrapper>
        {activeChatIds.map(c => (
          <WidgetChatWindow
            currentUser={currentUser}
            key={c._id}
            chatId={c}
            handleActive={handleActive}
          />
        ))}
      </WidgetChatWrapper>
    </>
  );
};

export default Widget;
