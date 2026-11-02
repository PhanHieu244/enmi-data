/* Between Tides d4: opt-in presentation/action bindings. No story arrays or rewards. */
(()=>{ "use strict"; globalThis.BT_D4_DATA = {
  "version": "d4",
  "flag": "BT_D4_ENABLED",
  "query": "bt-d4",
  "assetBase": "img/d4/",
  "art": [
    {
      "id": "r3-cabinet-three-ampoules",
      "path": "nodes.c2_cottage.17.explore.spots.2.then.1",
      "mode": "detail",
      "gate": "Only selected cabinet inspection; no need to infer that the independent kitchen-door spot was already opened. C4 reuse shows same three intact seals and empty ring.",
      "sourceQuote": "Next to it, the shelf is grey with dust, except for one clean ring where a bottle used to stand."
    },
    {
      "id": "r3-caller-notebook",
      "path": "nodes.c4_cottage.43",
      "mode": "detail",
      "gate": "At source notebook/pencil handoff after existing phone/photo work",
      "sourceQuote": "Leo turns to a clean page in his notebook and writes the time at the top. Then he holds the pencil out to you."
    },
    {
      "id": "r3-callum-logbook-handover",
      "path": "nodes.c4_boat.24.choice.1.then.4",
      "mode": "detail",
      "gate": "Only c4_boat choice[1] custody-threat branch after its existing commitment; never show on kindness branch",
      "sourceQuote": "He pulls a plastic-wrapped book from his oilskin and shoves it against your chest. The pages are swollen with damp."
    },
    {
      "id": "r3-callum-net-repair",
      "path": "places.c1_island.views.harbour.people.0.talk.hello.0",
      "mode": "detail",
      "gate": "C1 first harbour talk introduction, before the phone exchange; keep existing talk and revisit gates",
      "sourceQuote": "At the harbour, a man in his thirties is mending a net, hands red with cold. He doesn't look up."
    },
    {
      "id": "r3-channel-seat-cut-rope",
      "path": "nodes.c6_channel.7.then.0",
      "mode": "detail",
      "gate": "dunes_with===wait only at c6_channel@7.then[0]",
      "sourceQuote": "Her hands are empty. On the open passenger seat: sand and the cut end of a rope."
    },
    {
      "id": "r3-channel-wrapped-bundle",
      "path": "nodes.c6_moral.7.then.0.else.0",
      "mode": "detail",
      "gate": "c6_anna_confession && dunes_with!==wait, only existing companion-check line",
      "sourceQuote": "Your companion checks the open vehicle. A wrapped bundle lies inside, still dusted with pale sand."
    },
    {
      "id": "r3-cottage-phone-label",
      "path": "nodes.c2_cottage.17.explore.spots.4.then.1",
      "mode": "detail",
      "gate": "C2 hall-table spot and C4 label spot; distinct from Leo’s subsequent1471 action",
      "sourceQuote": "The receiver is on its cradle. Tom's number is on a yellowed label below the keypad."
    },
    {
      "id": "r3-dawn-jumper-return",
      "path": "nodes.c6_dawn_return.4.then.0",
      "mode": "detail",
      "gate": "c6_resolution===truth only at dawn; never use for mercy",
      "sourceQuote": "You take off the jumper, fold it, and hold it out. The morning goes cold through your shirt."
    },
    {
      "id": "r3-draft-in-stove",
      "path": "nodes.c2_cottage.17.explore.spots.1.then.0",
      "mode": "detail",
      "gate": "Before the take/leave decision or its guarded fallback; never use as taken/ash-only repeat",
      "sourceQuote": "The stove is still warm. In the [[grate]] there is a curl of burnt paper, one corner still white."
    },
    {
      "id": "r3-draft-table-handover",
      "path": "nodes.c3_station.23.then.1.choice.0.then.0",
      "mode": "detail",
      "gate": "took_draft && voluntary choice only, after original commitment",
      "sourceQuote": "You take the half-burnt letter out of your inside pocket and lay it on the table between you."
    },
    {
      "id": "r3-gideon-gate-handshake",
      "path": "places.c1_island.views.bighouse.people.0.talk.hello.2",
      "mode": "detail",
      "gate": "C1 big-house introduction after player gives company name; existing dialogue only",
      "sourceQuote": "You introduce yourself. Gideon hears the company name and takes your hand again."
    },
    {
      "id": "r3-gideon-incoming-call",
      "path": "nodes.c3_gideon.11",
      "mode": "detail",
      "gate": "Only after Gideon puts phone on table; no early clue",
      "sourceQuote": "He puts his phone on the table and turns it round for Leo to read."
    },
    {
      "id": "r3-helen-brass-plate",
      "path": "places.c1_island.views.surgery.zones.0.then.0",
      "mode": "read",
      "gate": "Only source plate spot; no new story record",
      "sourceQuote": "DR H. VOSPER · GENERAL PRACTITIONER"
    },
    {
      "id": "r3-helen-closed-bag",
      "path": "nodes.c5_surgery.7",
      "mode": "detail",
      "gate": "Only c5_surgery reached after c5_yard with dunes_with!==helen; excludes wait route and the separate dunes/torch examination",
      "sourceQuote": "She doesn't open the bag. She turns it under the lamp, slowly, with two fingers, the way she would turn a patient's head."
    },
    {
      "id": "r3-kitchen-door-opening",
      "path": "nodes.c2_cottage.17.explore.spots.0.then.1",
      "mode": "detail",
      "gate": "C2 kitchen spot, first opening only; no replay of discovery rewards",
      "sourceQuote": "When you open the door, Skerry pushes past your legs, runs to the back door and stands there, whining at the wood."
    },
    {
      "id": "r3-leo-fresh-gloves",
      "path": "nodes.c5_dunes.49",
      "mode": "detail",
      "gate": "Only after the exposed-hollow discovery on routes actually reaching c5_dunes; never pre-reveal or wait route",
      "sourceQuote": "He radios the location, then pulls on fresh gloves."
    },
    {
      "id": "r3-leo-receiver-return",
      "path": "nodes.c4_cottage.16.explore.spots.1.then.7",
      "mode": "detail",
      "gate": "C4 hall phone spot after its existing1471 response, before the note/deduction continuation; no new call",
      "sourceQuote": "He puts the receiver down very gently, as if it were part of the evidence. It is."
    },
    {
      "id": "r3-refuge-rope-lift",
      "path": "nodes.c2_boat.38",
      "mode": "detail",
      "gate": "told_leo===full; after Leo says take him back",
      "sourceQuote": "It takes all three of you, and a rope, to bring him down."
    },
    {
      "id": "r3-spade-blue-tape",
      "path": "nodes.c5_dunes.15.explore.spots.1.then.1.then.2",
      "mode": "detail",
      "gate": "Only dunes_with=callum, after hollow observation",
      "sourceQuote": "The blade is worn bright. The handle is wrapped in old blue tape."
    },
    {
      "id": "r3-tom-flask-pocket",
      "path": "nodes.c2_open.24",
      "mode": "detail",
      "gate": "After full flask at21:00, before Tom departure; do not reveal book/vial",
      "sourceQuote": "Tom slides the flask into his coat."
    },
    {
      "id": "r4-phonebox-number-card",
      "path": "places.c1_bar.views.yard.zones.1.then.0",
      "mode": "detail",
      "gate": "Only after selecting the phone-box zone; card stays in place and adds no numbers to records",
      "sourceQuote": "A red phone box beside the porch, lit for nobody. Inside, a laminated card of island numbers, curling at the corners."
    }
  ],
  "environments": [
    {
      "id": "r3-yard-central-composition",
      "path": "places.c1_bar.views.yard",
      "fallback": "lantern-yard",
      "regions": {
        "bt-lantern-landrover": [
          55,
          56,
          24,
          19
        ],
        "bt-lantern-phonebox": [
          18,
          46,
          9,
          24
        ],
        "bt-lantern-context": [
          14,
          40,
          69,
          40
        ]
      }
    },
    {
      "id": "r3-cellar-central-composition",
      "path": "places.c6_cellar.views.room",
      "fallback": "cellar",
      "regions": {
        "c6_phone": [
          20.5,
          24,
          5.5,
          13
        ],
        "c6_sink": [
          18,
          49,
          19,
          13
        ],
        "c6_steps": [
          72,
          17,
          15,
          59
        ]
      }
    }
  ],
  "expressions": [
    {
      "id": "r3-tom-surprised",
      "path": "nodes.c1_evening.56",
      "who": "tom",
      "mode": "live",
      "reason": "Urgent response to player asking about the ring; existing portrait costume and pose."
    },
    {
      "id": "r3-helen-smile",
      "path": "nodes.c4_open.17",
      "who": "helen",
      "mode": "live",
      "reason": "Restrained warmth in the possibility the player will listen; existing portrait costume."
    },
    {
      "id": "r3-dodd-cold",
      "path": "nodes.c5_vigil.22",
      "who": "dodd",
      "mode": "portrait",
      "reason": "Cardigan portrait only: does not replace seated blue-coat sprite."
    },
    {
      "id": "r3-dodd-surprised",
      "path": "nodes.c5_vigil.22",
      "who": "dodd",
      "mode": "portrait",
      "reason": "Cardigan portrait only: does not replace seated blue-coat sprite."
    },
    {
      "id": "r3-anna-sad",
      "path": "nodes.c5_open.43",
      "who": "anna",
      "mode": "portrait",
      "reason": "Optional portrait after Callum account; not a literal injured-body reenactment."
    },
    {
      "id": "r3-anna-cold",
      "path": "nodes.c5_open.43",
      "who": "anna",
      "mode": "portrait",
      "reason": "Optional portrait after Callum account; no witnessed mood assertion."
    },
    {
      "id": "r3-anna-surprised",
      "path": "nodes.c5_open.43",
      "who": "anna",
      "mode": "portrait",
      "reason": "Optional portrait after Callum account; no witnessed mood assertion."
    },
    {
      "id": "r3-callum14-smile",
      "path": "nodes.c5_open.43",
      "who": "callum14",
      "mode": "portrait",
      "reason": "Optional portrait after age14 account; never summon child actor in present-day room."
    },
    {
      "id": "r3-callum14-cold",
      "path": "nodes.c5_open.43",
      "who": "callum14",
      "mode": "portrait",
      "reason": "Optional portrait after age14 account; never summon child actor in present-day room."
    },
    {
      "id": "r4-dodd-seated-cold",
      "path": "nodes.c2_harbour.14",
      "who": "dodd",
      "mode": "costume",
      "reason": "Blue coat, blanket and stool retained; native seated-costume layer only."
    },
    {
      "id": "r4-dodd-seated-surprised",
      "path": "nodes.c2_harbour.30",
      "who": "dodd",
      "mode": "costume",
      "reason": "The lamp stops swinging while Dodd remains on her harbour bench; blue coat, blanket and stool retained. Does not summon hidden Dodd at c2_wait.33."
    }
  ],
  "actions": [
    {
      "id": "bottle-return",
      "chapter": 1,
      "paths": [
        "places.c1_bar.views.shelf.zones.0.then.0.else.1.choice.0.then.2",
        "places.c1_bar.views.shelf.zones.0.then.0.else.1.choice.0.then.4"
      ],
      "art": "r4-bottle-lift-start",
      "title": {
        "en": "Tom’s bottle",
        "vi": "Chai của Tom"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Lift the bottle to inspect",
            "vi": "Nhấc chai để xem"
          },
          "box": [
            40,
            15,
            27,
            63
          ],
          "dir": "u",
          "endArt": "act-label-clean"
        },
        {
          "kind": "swipe",
          "label": {
            "en": "Return it to the shelf",
            "vi": "Đặt lại lên kệ"
          },
          "box": [
            33,
            16,
            42,
            64
          ],
          "dir": "d",
          "endArt": "r4-bottle-return-end"
        }
      ],
      "gate": {
        "flag": "held_bottle",
        "eq": true
      },
      "proposal": "BT-R2-B-C1-04",
      "owner": "player",
      "kind": "optional-physical",
      "phaseAt": {
        "places.c1_bar.views.shelf.zones.0.then.0.else.1.choice.0.then.2": 0,
        "places.c1_bar.views.shelf.zones.0.then.0.else.1.choice.0.then.4": 1
      },
      "timing": "Phase 0 lifts before the existing label read; phase 1 returns the bottle at the existing return narration. The authored step arrays and read identity stay unchanged."
    },
    {
      "id": "kitchen-door",
      "chapter": 2,
      "paths": [
        "nodes.c2_cottage.17.explore.spots.0.then.1"
      ],
      "art": "r4-kitchen-door-start",
      "title": {
        "en": "The kitchen door",
        "vi": "Cửa bếp"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Open the kitchen door",
            "vi": "Mở cửa bếp"
          },
          "box": [
            34,
            31,
            40,
            40
          ],
          "dir": "r",
          "endArt": "r3-kitchen-door-opening"
        }
      ],
      "gate": null,
      "proposal": "BT-R2-B-C2-02",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "fold-draft",
      "chapter": 2,
      "paths": [
        "nodes.c2_cottage.17.explore.spots.1.then.3.choice.0.then.0",
        "nodes.c2_cottage.19.then.4.choice.0.then.0"
      ],
      "art": "r4-draft-fold-start",
      "title": {
        "en": "The burnt draft",
        "vi": "Bản nháp cháy dở"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Fold the paper carefully",
            "vi": "Gấp tờ giấy cẩn thận"
          },
          "box": [
            25,
            32,
            50,
            42
          ],
          "dir": "l",
          "endArt": "r4-draft-fold-end"
        }
      ],
      "gate": {
        "flag": "took_draft",
        "eq": true
      },
      "proposal": "BT-R2-B-C2-03",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "support-rope",
      "chapter": 2,
      "paths": [
        "nodes.c2_boat.38"
      ],
      "art": "r3-refuge-rope-lift",
      "title": {
        "en": "Help with the rope",
        "vi": "Cùng giữ dây"
      },
      "phases": [
        {
          "kind": "hold",
          "label": {
            "en": "Keep the rope steady",
            "vi": "Giữ chắc sợi dây"
          },
          "box": [
            22,
            55,
            41,
            32
          ],
          "hold": 650
        }
      ],
      "gate": {
        "flag": "told_leo",
        "eq": "full"
      },
      "proposal": "BT-R2-B-C2-05",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "draft-handover",
      "chapter": 3,
      "paths": [
        "nodes.c3_station.23.then.1.choice.0.then.0",
        "nodes.c3_station.23.then.1.choice.1.then.1"
      ],
      "art": "r3-draft-table-handover",
      "title": {
        "en": "Hand over the draft",
        "vi": "Giao bản nháp"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Let go of the draft on the table",
            "vi": "Buông bản nháp đã đặt trên bàn"
          },
          "box": [
            14,
            46,
            35,
            36
          ],
          "dir": "l"
        }
      ],
      "gate": {
        "all": [
          {
            "flag": "took_draft",
            "truthy": true
          },
          {
            "item": "draft"
          }
        ]
      },
      "proposal": "BT-R2-B-C3-01",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "wear-ring",
      "chapter": 5,
      "paths": [
        "nodes.c5_dunes.62"
      ],
      "art": "r4-ring-placement-start",
      "title": {
        "en": "The ring",
        "vi": "Chiếc nhẫn"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Put the ring on",
            "vi": "Đeo nhẫn vào"
          },
          "box": [
            28,
            26,
            50,
            56
          ],
          "dir": "d",
          "endArt": "cg-skull-ring"
        }
      ],
      "gate": {
        "item": "ring"
      },
      "proposal": "BT-R2-B-C5-05",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "return-jumper",
      "chapter": 6,
      "paths": [
        "nodes.c6_dawn_return.4.then.0"
      ],
      "art": "r3-dawn-jumper-return",
      "title": {
        "en": "Return the jumper",
        "vi": "Trả áo len"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Let Callum take the jumper’s weight",
            "vi": "Buông tay khi Callum đỡ áo"
          },
          "box": [
            50,
            56,
            43,
            35
          ],
          "dir": "d"
        }
      ],
      "gate": {
        "flag": "c6_resolution",
        "eq": "truth"
      },
      "proposal": "BT-R2-B-C6-05",
      "owner": "player",
      "kind": "optional-physical"
    },
    {
      "id": "turn-ring",
      "chapter": 1,
      "paths": [
        "nodes.c1_open.15"
      ],
      "art": "r4-ring-turn-closeup",
      "title": {
        "en": "The ring’s inner band",
        "vi": "Mặt trong chiếc nhẫn"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Turn the ring over",
            "vi": "Lật chiếc nhẫn"
          },
          "box": [
            25,
            26,
            50,
            48
          ],
          "dir": "r",
          "endArt": "it-ring-in"
        }
      ],
      "gate": {
        "item": "ring"
      },
      "proposal": null,
      "owner": "player",
      "kind": "additional-inspection"
    },
    {
      "id": "note-crease",
      "chapter": 1,
      "paths": [
        "nodes.c1_open.31"
      ],
      "art": "r4-note-crease-closeup",
      "title": {
        "en": "The folded note",
        "vi": "Mẩu thư đã gấp"
      },
      "phases": [
        {
          "kind": "swipe",
          "label": {
            "en": "Open along the crease",
            "vi": "Mở theo nếp gấp"
          },
          "box": [
            22,
            25,
            56,
            52
          ],
          "dir": "r",
          "endArt": "it-note"
        }
      ],
      "gate": {
        "item": "note"
      },
      "proposal": null,
      "owner": "player",
      "kind": "additional-inspection"
    },
    {
      "id": "phone-label",
      "chapter": 2,
      "paths": [
        "nodes.c2_cottage.17.explore.spots.4.then.2"
      ],
      "art": "r4-cottage-phone-label-closeup",
      "title": {
        "en": "The telephone label",
        "vi": "Nhãn trên điện thoại"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Inspect the label",
            "vi": "Xem nhãn số"
          },
          "box": [
            49,
            54,
            30,
            20
          ]
        }
      ],
      "gate": null,
      "proposal": null,
      "owner": "player observes the phone in place",
      "kind": "additional-inspection",
      "recordPath": "nodes.c2_cottage.17.explore.spots.4.then.2.n",
      "captionWhen": "after"
    },
    {
      "id": "gideon-history",
      "chapter": 3,
      "paths": [
        "nodes.c3_gideon.12"
      ],
      "art": "r4-gideon-call-screen-closeup",
      "title": {
        "en": "Gideon’s call history",
        "vi": "Lịch sử cuộc gọi của Gideon"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Read the completed-call entry",
            "vi": "Xem cuộc gọi đã kết thúc"
          },
          "box": [
            31,
            35,
            28,
            41
          ]
        }
      ],
      "gate": null,
      "proposal": null,
      "owner": "Gideon owns the phone; player observes",
      "kind": "additional-inspection",
      "recordPath": "nodes.c3_gideon.12.n",
      "captionWhen": "after"
    },
    {
      "id": "receive-pencil",
      "chapter": 4,
      "paths": [
        "nodes.c4_cottage.43"
      ],
      "art": "r4-notebook-pencil-receive",
      "title": {
        "en": "Leo’s notebook",
        "vi": "Sổ của Leo"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Take the offered pencil",
            "vi": "Nhận cây bút được đưa"
          },
          "box": [
            35,
            42,
            24,
            28
          ]
        }
      ],
      "gate": null,
      "proposal": null,
      "owner": "Leo offers; player receives pencil; no answer written",
      "kind": "additional-inspection"
    },
    {
      "id": "logbook-light",
      "chapter": 5,
      "paths": [
        "nodes.c5_book.20"
      ],
      "art": "r4-logbook-lamp-tilt",
      "title": {
        "en": "The page under the lamp",
        "vi": "Trang sổ dưới đèn"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Examine the faint pencil beneath the ink",
            "vi": "Xem nét chì mờ dưới mực"
          },
          "box": [
            25,
            24,
            50,
            50
          ]
        }
      ],
      "gate": null,
      "proposal": null,
      "owner": "Leo tilts his book; player examines",
      "kind": "additional-inspection"
    },
    {
      "id": "cellar-calls",
      "chapter": 6,
      "paths": [
        "places.c6_cellar.views.phone.zones.0.then.4"
      ],
      "art": "r4-cellar-call-list-closeup",
      "title": {
        "en": "Outgoing calls",
        "vi": "Cuộc gọi đi"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Photograph the call list in place",
            "vi": "Chụp danh sách cuộc gọi tại chỗ"
          },
          "box": [
            40,
            19,
            20,
            19
          ]
        }
      ],
      "gate": {
        "all": [
          {
            "flag": "c6_read_calls",
            "eq": true
          },
          {
            "item": "calllist"
          }
        ]
      },
      "proposal": null,
      "owner": "Player photographs handset in place after native record; does not take handset or grant record again",
      "kind": "additional-inspection",
      "recordPath": "places.c6_cellar.views.phone.zones.0.then.1.read",
      "captionWhen": "before"
    },
    {
      "id": "cellar-contact",
      "chapter": 6,
      "paths": [
        "places.c6_cellar.views.phone.zones.1.then.0"
      ],
      "art": "r4-cellar-directory-closeup",
      "title": {
        "en": "Saved contact",
        "vi": "Danh bạ đã lưu"
      },
      "phases": [
        {
          "kind": "tap",
          "label": {
            "en": "Open the saved contact",
            "vi": "Mở liên hệ đã lưu"
          },
          "box": [
            45,
            57,
            14,
            17
          ]
        }
      ],
      "gate": null,
      "proposal": null,
      "owner": "Read the saved contact; no dialing",
      "kind": "additional-inspection",
      "recordPath": "places.c6_cellar.views.phone.zones.1.then.0.read",
      "captionWhen": "after"
    }
  ],
  "phones": [
    {
      "id": "gideon-history",
      "mode": "history",
      "operator": "gideon",
      "art": "r4-gideon-call-screen-closeup",
      "source": "nodes.c3_gideon.12",
      "recordAt": "nodes.c3_gideon.13",
      "ringing": false,
      "why": "Completed incoming call 21:08 for7:12 shown at23:50; Answer/Mute would invent a new live call."
    },
    {
      "id": "cottage-label",
      "mode": "label",
      "operator": "none",
      "art": "r4-cottage-phone-label-closeup",
      "source": "nodes.c2_cottage.17.explore.spots.4.then.2",
      "recordAt": "nodes.c2_cottage.17.explore.spots.4.then.3",
      "ringing": false,
      "why": "Phone stays on cradle; player reads label, never dials in C2."
    },
    {
      "id": "cottage-1471",
      "mode": "recorded-service",
      "operator": "leo",
      "art": "r3-leo-receiver-return",
      "source": "nodes.c4_cottage.16.explore.spots.1.then",
      "ringing": false,
      "why": "Leo lifts receiver and dials1471; response is last-call service, not a live incoming call."
    },
    {
      "id": "cellar-calls",
      "mode": "history",
      "operator": "player",
      "art": "r4-cellar-call-list-closeup",
      "source": "places.c6_cellar.views.phone.zones.0.then",
      "recordAt": "places.c6_cellar.views.phone.zones.0.then.2",
      "ringing": false,
      "why": "Read CALLS MADE and photograph in situ; original item grant remains sole owner."
    },
    {
      "id": "cellar-directory",
      "mode": "directory",
      "operator": "player",
      "art": "r4-cellar-directory-closeup",
      "source": "places.c6_cellar.views.phone.zones.1.then",
      "recordAt": "places.c6_cellar.views.phone.zones.1.then.1",
      "ringing": false,
      "why": "Verify saved number separately; never adds a call or reveals before selected zone."
    }
  ]
}; })();
