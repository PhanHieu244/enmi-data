/* Statement-specific facade; common surface/adapter is plugins/phone-surface.js.
 * This game owns its data, contact identities and opt-in. No core fork. */
(function(g){'use strict';
 if(!g.StoryPhone)throw new Error('Load plugins/phone-surface.js before statement-phone.js.');
 const install=(E,data,options={})=>g.StoryPhone.install(E,data,{layerClass:'statement-phone-layer',...options});
 g.StatementPhone={...g.StoryPhone,install};
 if(g.StatementPhoneEnable===true&&g.StoryEngine&&g.StatementPhoneData)
   install(g.StoryEngine,g.StatementPhoneData,g.StatementPhoneOptions||{});
})(globalThis);
