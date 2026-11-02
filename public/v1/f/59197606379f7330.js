/* Data only; exact existing narration anchors, no story mutation. */
globalThis.StatementActionData = {
  "schema": 1,
  "game": "the-interpreter",
  "engineBaseline": "1.0.4",
  "version": "direction-d1",
  "entries": [
    {
      "id": "st-a1-inspect-knuckles-d1",
      "chapter": 1,
      "node": "pier",
      "kind": "n",
      "matchEn": "His [[knuckles]] are red and cut. The cuts are fresh.",
      "source": "the-interpreter/story/ch1.js:12",
      "paths": [
        [
          13,
          "explore",
          "spots",
          5,
          "then",
          0,
          "choice",
          1,
          "then",
          0
        ],
        [
          13,
          "explore",
          "spots",
          5,
          "again",
          0,
          0,
          "then",
          1,
          "choice",
          1,
          "then",
          0
        ]
      ],
      "verb": {
        "en": "Examine his hand",
        "vi": "Xem kỹ bàn tay"
      },
      "purpose": "Quan sát vết mới; không đổi sang kết luận ai gây án.",
      "generated": {
        "file": "img/st-act-knuckles-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 41,
        "radius": 20,
        "status": "candidate d1 raster viewed; wounds at knuckle ridge"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a1-photograph-watch-d1",
      "chapter": 1,
      "node": "pier",
      "kind": "n",
      "matchEn": "The wrist is slender. A cheap digital watch is wet inside; its display is frozen at 1:47. You photograph it without touching the body.",
      "source": "the-interpreter/story/ch1.js:180",
      "paths": [
        [
          13,
          "explore",
          "spots",
          0,
          "then",
          2
        ]
      ],
      "verb": {
        "en": "Photograph the watch",
        "vi": "Chụp chiếc đồng hồ"
      },
      "purpose": "Chụp tại chỗ; không nhặt đồng hồ, không gán 1:47 là giờ chết.",
      "generated": {
        "file": "img/st-act-watch-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": {
        "id": "cg-body",
        "file": "img/cg-body.webp",
        "size": [
          1024,
          1536
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "photograph",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [
        {
          "text": {
            "en": "1:47",
            "vi": "1:47"
          },
          "x": 62.86,
          "y": 45.34,
          "width": 10.35,
          "rotate": -17.3,
          "fontCqw": 3.6,
          "fontFamily": "monospace",
          "color": "#e7f0d9",
          "whiteSpace": "nowrap",
          "source": "ch1.js pier body observation: damaged watch display; not a certified time of death"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a1-read-wristband-d1",
      "chapter": 1,
      "node": "d_car",
      "kind": "n",
      "matchEn": "He rubs his wrist. A paper festival wristband: 'KIERAN · 14·02'.",
      "source": "the-interpreter/story/ch1.js:287",
      "paths": [
        [
          6
        ]
      ],
      "verb": {
        "en": "Read the wristband",
        "vi": "Đọc chiếc vòng tay"
      },
      "purpose": "Vòng giấy lễ hội trên cổ tay Kieran, chăn xám trong xe. KIERAN · 14·02 là DOM đúng nguồn; không biến thành vòng bệnh viện.",
      "generated": {
        "file": "img/st-act-wristband-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 51.5,
        "y": 43.5,
        "shape": "frame",
        "width": 35,
        "height": 13,
        "rotate": 16.6,
        "status": "tap frame surrounds band without circling over its small digits; candidate d1 raster viewed"
      },
      "overlays": [
        {
          "text": {
            "en": "KIERAN · 14·02",
            "vi": "KIERAN · 14·02"
          },
          "x": 51.5,
          "y": 42.3,
          "width": 22,
          "rotate": 16.6,
          "fontCqw": 2.3,
          "fontFamily": "Arial, sans-serif",
          "whiteSpace": "nowrap",
          "source": "ch1.js d_car[6].n"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a1-slide-sam-photo-d1",
      "chapter": 1,
      "node": "interview",
      "kind": "n",
      "matchEn": "You slide the photo across the table. Kieran looks at it — and goes white.",
      "source": "the-interpreter/story/ch1.js:396",
      "paths": [
        [
          29,
          "choice",
          1,
          "then",
          0
        ]
      ],
      "verb": {
        "en": "Slide the photograph over",
        "vi": "Đẩy ảnh qua bàn"
      },
      "purpose": "Chỉ trong lựa chọn đưa sam_photo đã có; phản ứng Kieran và cờ giữ nguyên.",
      "generated": {
        "file": "img/st-act-sam-photo-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "sam_photo",
        "prop": {
          "en": "Sam’s photograph",
          "vi": "Ảnh Sam"
        },
        "destination": {
          "en": "Across the table",
          "vi": "Qua bàn"
        },
        "art": {
          "file": "img/evidence-sheet-1.webp",
          "size": [
            409,
            386
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            422,
            2,
            409,
            386
          ],
          "aspect": 1.0595854922279793,
          "sheet": [
            3,
            3
          ],
          "cell": [
            1,
            0
          ],
          "fit": "contain"
        },
        "requiresOwnership": true
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a2-open-report-d1",
      "chapter": 2,
      "node": "c2",
      "kind": "n",
      "matchEn": "You open the folder. A photo is clipped to the first page. You don't look at it. Not yet.",
      "source": "the-interpreter/story/ch2.js:78",
      "paths": [
        [
          8
        ]
      ],
      "verb": {
        "en": "Open the folder",
        "vi": "Mở tập hồ sơ"
      },
      "purpose": "Ảnh nhận dạng vẫn úp/kẹp; chưa cho nhìn mặt Danny trước nhà xác.",
      "generated": null,
      "fallback": {
        "id": "act-report",
        "file": "img/action-sheet-1.webp",
        "size": [
          501,
          328
        ],
        "rect": [
          1033,
          345,
          501,
          328
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "reveal",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a2-inspect-photo-wall-d1",
      "chapter": 2,
      "node": "c2_shop",
      "kind": "n",
      "matchEn": "Someone has torn one face out of the photo. Just one. The boy next to the hole wears a green parka.",
      "source": "the-interpreter/story/ch2.js:162",
      "paths": [
        [
          15,
          "explore",
          "spots",
          1,
          "then",
          1
        ]
      ],
      "verb": {
        "en": "Look closely at the photograph",
        "vi": "Xem kỹ tấm ảnh"
      },
      "purpose": "Đúng một mặt bị xé; chỉ nhận ra áo parka quen, chưa tự khẳng định người mặc là Sam.",
      "generated": {
        "file": "img/st-act-photo-wall-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a2-photograph-parka-d1",
      "chapter": 2,
      "node": "c2_kitchen",
      "kind": "n",
      "matchEn": "Old jackets. And one you know too well: a green parka, the left cuff torn. You'd know it anywhere.",
      "source": "the-interpreter/story/ch2.js:181",
      "paths": [
        [
          2,
          "sneak",
          "rows",
          0,
          "opts",
          0,
          "then",
          0
        ]
      ],
      "verb": {
        "en": "Photograph the coat",
        "vi": "Chụp chiếc áo"
      },
      "purpose": "sam_jacket là ảnh, áo vẫn sau cửa bếp. Không lấy áo khỏi quán.",
      "generated": null,
      "fallback": {
        "id": "act-jacket",
        "file": "img/action-sheet-1.webp",
        "size": [
          506,
          333
        ],
        "rect": [
          516,
          2,
          506,
          333
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "photograph",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a2-lay-out-records-d1",
      "chapter": 2,
      "node": "c2_think",
      "kind": "n",
      "matchEn": "Back at the station, you spread everything on your desk.",
      "source": "the-interpreter/story/ch2.js:235",
      "paths": [
        [
          1
        ]
      ],
      "verb": {
        "en": "Lay out the records",
        "vi": "Bày hồ sơ lên bàn"
      },
      "purpose": "Bố cục các nguồn trước board; không bật đồ chưa có hoặc nối hộ cặp đúng.",
      "generated": null,
      "fallback": {
        "id": "act-compare",
        "file": "img/action-sheet-2.webp",
        "size": [
          509,
          335
        ],
        "rect": [
          514,
          2,
          509,
          335
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "notes",
        "prop": {
          "en": "Case records",
          "vi": "Hồ sơ vụ án"
        },
        "destination": {
          "en": "Desk",
          "vi": "Mặt bàn"
        },
        "art": {
          "file": "img/evidence-sheet-1.webp",
          "size": [
            412,
            476
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            2,
            776,
            412,
            476
          ],
          "aspect": 0.865546218487395,
          "sheet": [
            3,
            3
          ],
          "cell": [
            0,
            2
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a3-read-parking-ticket-d1",
      "chapter": 3,
      "node": "c3_hosp",
      "kind": "n",
      "matchEn": "You go outside and read it through the glass. 'GULL POINT CAR PARK — TUE 23:41.'",
      "source": "the-interpreter/story/ch3.js:86",
      "paths": [
        [
          5,
          "explore",
          "spots",
          1,
          "then",
          1
        ]
      ],
      "verb": {
        "en": "Read through the glass",
        "vi": "Đọc qua lớp kính"
      },
      "purpose": "Đổi góc cận xe, không lấy vé/đột nhập xe. Vé trên táp-lô được đọc qua kính; chữ EN/VI đúng n gốc, không suy ra giờ hiện tại.",
      "generated": {
        "file": "img/st-act-ticket-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": {
        "id": "act-ticket",
        "file": "img/action-sheet-1.webp",
        "size": [
          504,
          340
        ],
        "rect": [
          2,
          682,
          504,
          340
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 49,
        "y": 47.5,
        "shape": "frame",
        "width": 61,
        "height": 21,
        "rotate": -8,
        "status": "tap frame surrounds paper through windscreen; does not imply taking the ticket"
      },
      "overlays": [
        {
          "text": {
            "en": "GULL POINT CAR PARK — TUE 23:41.",
            "vi": "BÃI XE GULL POINT — THỨ BA 23:41."
          },
          "x": 48,
          "y": 47.3,
          "width": 43,
          "rotate": -8,
          "fontCqw": 3.6,
          "fontFamily": "Arial, sans-serif",
          "source": "ch3.js c3_hosp explore car n, line 86; punctuation follows this n rather than item description"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a3-open-finch-drawer-d1",
      "chapter": 3,
      "node": "c3_arch",
      "kind": "n",
      "matchEn": "Inside: a cassette tape and a folded note.",
      "source": "the-interpreter/story/ch3.js:170",
      "paths": [
        [
          9
        ]
      ],
      "verb": {
        "en": "Open the drawer",
        "vi": "Mở ngăn kéo"
      },
      "purpose": "Chỉ tới sau lock/giveUp gốc. finch_tape và finch_note do item gốc cấp.",
      "generated": null,
      "fallback": {
        "id": "act-drawer",
        "file": "img/action-sheet-1.webp",
        "size": [
          501,
          340
        ],
        "rect": [
          1033,
          682,
          501,
          340
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "reveal",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a3-play-lewis-tape-d1",
      "chapter": 3,
      "node": "c3_arch",
      "kind": "n",
      "matchEn": "You find the old player on a shelf and press PLAY. A boy's voice, two years ago. Then the typed statement Finch filed the same day.",
      "source": "the-interpreter/story/ch3.js:172",
      "paths": [
        [
          12
        ]
      ],
      "verb": {
        "en": "Press PLAY",
        "vi": "Bấm PLAY"
      },
      "purpose": "Gắn thao tác nghe với compare Lewis; nút PLAY đúng vị trí máy trong ảnh. Không đổi bản ghi hay các dòng sai.",
      "generated": {
        "file": "img/st-act-tape-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": {
        "id": "act-tape",
        "file": "img/action-sheet-1.webp",
        "size": [
          506,
          340
        ],
        "rect": [
          516,
          682,
          506,
          340
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "playback",
      "transfer": null,
      "target": {
        "x": 52.6,
        "y": 71.8,
        "radius": 20,
        "status": "physical PLAY key on candidate recorder, not the cassette window"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a3-photograph-threat-d1",
      "chapter": 3,
      "node": "c3_night",
      "kind": "n",
      "matchEn": "You photograph the envelope, the threat and the enclosed image before deciding what to do with the originals.",
      "source": "the-interpreter/story/ch3.js:253",
      "paths": [
        [
          18
        ]
      ],
      "verb": {
        "en": "Photograph the originals",
        "vi": "Chụp lại các bản gốc"
      },
      "purpose": "Trước lựa chọn đưa/đốt/giữ, cùng item letter ảnh bảo toàn; không tự thêm custody mới.",
      "generated": null,
      "fallback": {
        "id": "cg-letter",
        "file": "img/cg-letter.webp",
        "size": [
          1024,
          1536
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "photograph",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a4-take-invitation-d1",
      "chapter": 4,
      "node": "c4",
      "kind": "n",
      "matchEn": "Day 4. A thick cream envelope is waiting on your desk. Your name is handwritten in gold ink.",
      "source": "the-interpreter/story/ch4.js:63",
      "paths": [
        [
          2
        ]
      ],
      "verb": {
        "en": "Pick up the invitation",
        "vi": "Cầm thiệp mời"
      },
      "purpose": "Mặt địa chỉ để trống vì chưa xác minh API tên người chơi. Không in placeholder hoặc tự đặt tên; n gốc vẫn đọc thông tin đã duyệt.",
      "generated": {
        "file": "img/st-act-invite-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "invite",
        "prop": {
          "en": "Invitation",
          "vi": "Thiệp mời"
        },
        "destination": {
          "en": "Your hand",
          "vi": "Tay bạn"
        },
        "art": {
          "file": "img/evidence-sheet-3.webp",
          "size": [
            413,
            384
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            420,
            2,
            413,
            384
          ],
          "aspect": 1.0755208333333333,
          "sheet": [
            3,
            3
          ],
          "cell": [
            1,
            0
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a4-move-painting-d1",
      "chapter": 4,
      "node": "c4_wire",
      "kind": "n",
      "matchEn": "The painting moves when you touch it. Behind it: a wall safe with five letter dials.",
      "source": "the-interpreter/story/ch4.js:166",
      "paths": [
        [
          3,
          "explore",
          "spots",
          2,
          "then",
          0
        ]
      ],
      "verb": {
        "en": "Examine the closed safe",
        "vi": "Xem két còn khoá"
      },
      "purpose": "Chỉ hình két ĐÓNG sau tranh, chưa thấy tiền/sổ. Không dùng cg-safe mở trước lock/MARTA; saw_safe do bước gốc set.",
      "generated": {
        "file": "img/st-act-safe-closed-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 48,
        "y": 36,
        "radius": 20,
        "status": "candidate d1 raster viewed; five closed-safe drums"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a4-photograph-ledger-d1",
      "chapter": 4,
      "node": "c4_wire",
      "kind": "n",
      "matchEn": "Cash. A black leather [[ledger]]. You unplug the phone just long enough to photograph the marked pages, then reconnect it beside your chair.",
      "source": "the-interpreter/story/ch4.js:175",
      "paths": [
        [
          4,
          "then",
          0,
          "lock",
          "ok",
          2
        ]
      ],
      "verb": {
        "en": "Photograph the marked pages",
        "vi": "Chụp trang được đánh dấu"
      },
      "purpose": "Rút sạc vừa đủ để chụp rồi cắm lại theo n gốc; không sửa charged/tape_holt.",
      "generated": null,
      "fallback": {
        "id": "act-ledger",
        "file": "img/action-sheet-2.webp",
        "size": [
          509,
          337
        ],
        "rect": [
          514,
          342,
          509,
          337
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "photograph",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a4-take-gullpoint-key-d1",
      "chapter": 4,
      "node": "c4_kitchen",
      "kind": "n",
      "matchEn": "She presses something cold into your hand. A heavy iron key.",
      "source": "the-interpreter/story/ch4.js:219",
      "paths": [
        [
          8,
          "then",
          0,
          "choice",
          0,
          "then",
          5
        ]
      ],
      "verb": {
        "en": "Take the key",
        "vi": "Nhận chìa khoá"
      },
      "purpose": "Chỉ nhánh confess có n này; nhánh forced vốn cấp item trực tiếp giữ nguyên.",
      "generated": null,
      "fallback": {
        "id": "act-key",
        "file": "img/action-sheet-2.webp",
        "size": [
          507,
          337
        ],
        "rect": [
          1027,
          342,
          507,
          337
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "gp_key",
        "prop": {
          "en": "Gate key",
          "vi": "Chìa cổng"
        },
        "destination": {
          "en": "Your hand",
          "vi": "Tay bạn"
        },
        "art": {
          "file": "img/evidence-sheet-3.webp",
          "size": [
            413,
            403
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            420,
            392,
            413,
            403
          ],
          "aspect": 1.0248138957816377,
          "sheet": [
            3,
            3
          ],
          "cell": [
            1,
            1
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a5-pick-up-crowbar-d1",
      "chapter": 5,
      "node": "c5_storm",
      "kind": "n",
      "matchEn": "Something metal in the water at the bottom of the wall. A rusty crowbar, left by the fishermen.",
      "source": "the-interpreter/story/ch5.js:121",
      "paths": [
        [
          6,
          "explore",
          "spots",
          0,
          "then",
          0
        ]
      ],
      "verb": {
        "en": "Pick up the crowbar",
        "vi": "Nhặt xà beng"
      },
      "purpose": "Giữ thời gian -1 ở add gốc; không cho dùng trước khi nhận item.",
      "generated": {
        "file": "img/st-act-crowbar-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "crowbar",
        "prop": {
          "en": "Crowbar",
          "vi": "Xà beng"
        },
        "destination": {
          "en": "Your hand",
          "vi": "Tay bạn"
        },
        "art": {
          "file": "img/evidence-sheet-3.webp",
          "size": [
            414,
            403
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            838,
            392,
            414,
            403
          ],
          "aspect": 1.0272952853598014,
          "sheet": [
            3,
            3
          ],
          "cell": [
            2,
            1
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a5-lift-floorboard-d1",
      "chapter": 5,
      "node": "c5_gp",
      "kind": "n",
      "matchEn": "Under it: a cassette tape wrapped in plastic. 'H.F. — 12 OCT'.",
      "source": "the-interpreter/story/ch5.js:162",
      "paths": [
        [
          10,
          "explore",
          "spots",
          0,
          "then",
          2
        ]
      ],
      "verb": {
        "en": "Lift the loose floorboard",
        "vi": "Nhấc tấm ván lỏng"
      },
      "purpose": "Chỉ sau khi tìm đúng giường; băng chưa phát ở kho. Chi phí thời gian giữ nguyên.",
      "generated": null,
      "fallback": {
        "id": "act-floor",
        "file": "img/action-sheet-2.webp",
        "size": [
          507,
          338
        ],
        "rect": [
          1027,
          684,
          507,
          338
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "reveal",
      "transfer": null,
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a5-leave-rescue-note-d1",
      "chapter": 5,
      "node": "c5_cold",
      "kind": "n",
      "matchEn": "You leave a written note for the rescue crew: 'Going to Gull Head with the harbour volunteer's directions. Sam may be inside.' The cliff footpath starts behind the cannery; it does not cross the water.",
      "source": "the-interpreter/story/ch5.js:214",
      "paths": [
        [
          18
        ]
      ],
      "verb": {
        "en": "Leave the route note",
        "vi": "Để lại giấy chỉ đường"
      },
      "purpose": "Chỉ in lời nằm trong dấu trích dẫn của n; không in thêm bản đồ hay câu hướng đi ngoài tờ giấy. Gull Head theo đường bộ ven vách, không qua biển. Bệ đặt giấy là đề xuất dàn dựng, chưa là đạo cụ canon.",
      "generated": {
        "file": "img/st-act-rescue-note-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": null,
        "prop": {
          "en": "Route note",
          "vi": "Giấy chỉ đường"
        },
        "destination": {
          "en": "For the rescue crew",
          "vi": "Cho tổ cứu hộ"
        },
        "art": null,
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [
        {
          "text": {
            "en": "Going to Gull Head with the harbour volunteer's directions. Sam may be inside.",
            "vi": "Tới Gull Head theo chỉ đường của tình nguyện viên. Sam có thể ở trong."
          },
          "x": 59.5,
          "y": 47.5,
          "width": 40,
          "rotate": 2,
          "fontCqw": 3.7,
          "source": "ch5.js c5_cold n, line 214; quoted paper text only"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a5-receive-sam-book-d1",
      "chapter": 5,
      "node": "c5_light",
      "kind": "n",
      "matchEn": "A battered school notebook. Every page: names, numbers, dates, vans.",
      "source": "the-interpreter/story/ch5.js:253",
      "paths": [
        [
          21,
          "else",
          1
        ]
      ],
      "verb": {
        "en": "Take Sam’s notebook",
        "vi": "Nhận sổ của Sam"
      },
      "purpose": "Chỉ nhánh holt != yes; không cho nhánh kept nhìn nội dung sổ hoặc nhận T12.",
      "generated": {
        "file": "img/st-act-notebook-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": {
        "id": "act-notebook",
        "file": "img/action-sheet-3.webp",
        "size": [
          506,
          335
        ],
        "rect": [
          515,
          2,
          506,
          335
        ],
        "sourceSize": [
          1536,
          1024
        ]
      },
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "sam_book",
        "prop": {
          "en": "Sam’s notebook",
          "vi": "Sổ của Sam"
        },
        "destination": {
          "en": "Your hand",
          "vi": "Tay bạn"
        },
        "art": {
          "file": "img/evidence-sheet-3.webp",
          "size": [
            413,
            450
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            420,
            802,
            413,
            450
          ],
          "aspect": 0.9177777777777778,
          "sheet": [
            3,
            3
          ],
          "cell": [
            1,
            2
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a5-inspect-torn-oilskin-d1",
      "chapter": 5,
      "node": "c5_pier",
      "kind": "n",
      "matchEn": "You twist away and catch his coat at the shoulder. A strip tears free, including the sewn-in label. You keep hold of it.",
      "source": "the-interpreter/story/ch5.js:299",
      "paths": [
        [
          16,
          "qte",
          "ok",
          0
        ]
      ],
      "verb": {
        "en": "Check the torn cloth",
        "vi": "Xem mảnh áo vừa giữ được"
      },
      "purpose": "Chỉ QTE thành công; nhãn MARTA — 3, không tự cấp oilskin khi fail.",
      "generated": {
        "file": "img/st-act-oilskin-label-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 60,
        "y": 55,
        "radius": 20,
        "status": "below label to avoid covering exact text; recheck if root edits raster"
      },
      "overlays": [
        {
          "text": {
            "en": "MARTA — 3",
            "vi": "MARTA — 3"
          },
          "x": 59.8,
          "y": 42.5,
          "width": 33,
          "rotate": 13,
          "fontCqw": 3.5,
          "source": "ch5.js items.oilskin.desc"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a6-arrange-court-records-d1",
      "chapter": 6,
      "node": "c6_court",
      "kind": "n",
      "matchEn": "The courtroom is quiet. You take the oath. The clerk places the original statement, the amended draft and the recording log in front of you.",
      "source": "the-interpreter/story/ch6.js:80",
      "paths": [
        [
          3
        ]
      ],
      "verb": {
        "en": "Arrange the source documents",
        "vi": "Đặt các bản hồ sơ cạnh nhau"
      },
      "purpose": "Bản gốc, bản có đính chính và log khác nhau. Không ghi sẵn nội dung phiên bản không thuộc nhánh.",
      "generated": {
        "file": "img/st-act-court-records-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": "notes",
        "prop": {
          "en": "Source documents",
          "vi": "Các bản hồ sơ"
        },
        "destination": {
          "en": "Witness desk",
          "vi": "Bàn làm chứng"
        },
        "art": {
          "file": "img/evidence-sheet-1.webp",
          "size": [
            412,
            476
          ],
          "sourceSize": [
            1254,
            1254
          ],
          "rect": [
            2,
            776,
            412,
            476
          ],
          "aspect": 0.865546218487395,
          "sheet": [
            3,
            3
          ],
          "cell": [
            0,
            2
          ],
          "fit": "contain"
        },
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [
        {
          "text": {
            "en": "Original statement",
            "vi": "Bản lời khai gốc"
          },
          "x": 20,
          "y": 54,
          "width": 23,
          "rotate": 0,
          "fontCqw": 3.4,
          "source": "ch6.js c6_court[3].n"
        },
        {
          "text": {
            "en": "Amended draft",
            "vi": "Dự thảo có đính chính"
          },
          "x": 50,
          "y": 54,
          "width": 23,
          "rotate": 0,
          "fontCqw": 3.4,
          "source": "ch6.js c6_court[3].n"
        },
        {
          "text": {
            "en": "Recording log",
            "vi": "Nhật ký ghi âm"
          },
          "x": 80,
          "y": 54,
          "width": 23,
          "rotate": 0,
          "fontCqw": 3.4,
          "source": "ch6.js c6_court[3].n"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a6-open-finch-letter-d1",
      "chapter": 6,
      "node": "c6_finch",
      "kind": "n",
      "matchEn": "A week later, Finch's daughter brings a letter from his papers. The envelope is addressed simply: 'To whoever takes my place.' She had kept it because she did not know whom to trust.",
      "source": "the-interpreter/story/ch6.js:165",
      "paths": [
        [
          3
        ]
      ],
      "verb": {
        "en": "Read Finch’s letter",
        "vi": "Đọc thư Finch"
      },
      "purpose": "Đây là lá thư đọc bằng giọng Finch, không phải điện thoại. Ảnh lộ mặt sau phong bì: địa chỉ chỉ có ở DOM readout ngoài ảnh, không in lên nắp sau/tờ thư. Không quảng cáo animation mở khi thiếu cặp trước/sau.",
      "generated": {
        "file": "img/st-act-finch-letter-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 61,
        "y": 39,
        "radius": 20,
        "status": "exposed letter sheet; envelope address stays outside the artwork"
      },
      "overlays": [
        {
          "text": {
            "en": "To whoever takes my place.",
            "vi": "Gửi người nhận công việc thay tôi."
          },
          "onArt": false,
          "source": "ch6.js c6_finch[3].n; readout only because candidate shows envelope reverse, not its address face"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a6-turn-holt-card-d1",
      "chapter": 6,
      "node": "c6_faithful",
      "kind": "n",
      "matchEn": "Holt sends flowers. The card says: 'Beautifully written.' You keep the original recording. Keeping it is the only honest thing you have done today.",
      "source": "the-interpreter/story/ch6.js:195",
      "paths": [
        [
          2
        ]
      ],
      "verb": {
        "en": "Read the enclosed card",
        "vi": "Đọc thiệp kèm theo"
      },
      "purpose": "Chỉ nhánh e_faithful. Beautifully written do DOM, không tạo manh mối mới. Không quảng cáo lật hai mặt khi chỉ có ảnh một mặt.",
      "generated": {
        "file": "img/st-act-flowers-card-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "inspect",
      "transfer": null,
      "target": {
        "x": 54,
        "y": 64,
        "shape": "frame",
        "width": 62,
        "height": 23,
        "rotate": 9,
        "status": "tap frame surrounds cream card, keeping its source lettering clear"
      },
      "overlays": [
        {
          "text": {
            "en": "Beautifully written.",
            "vi": "Viết đẹp lắm."
          },
          "x": 55,
          "y": 65,
          "width": 40,
          "rotate": 9,
          "fontCqw": 3.8,
          "source": "ch6.js c6_faithful n, line 195"
        }
      ],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    },
    {
      "id": "st-a6-place-warrant-card-d1",
      "chapter": 6,
      "node": "c6_struck",
      "kind": "n",
      "matchEn": "Sam is safe with the support team. The case files pass to another investigator, including every correction you refused to make. You leave your warrant card on Ruth's desk.",
      "source": "the-interpreter/story/ch6.js:209",
      "paths": [
        [
          4
        ]
      ],
      "verb": {
        "en": "Place your warrant card on the desk",
        "vi": "Đặt thẻ ngành lên bàn"
      },
      "purpose": "Hình đúng thẻ ngành UK vô danh; đây là endpoint của đình chỉ, không huỷ save.",
      "generated": {
        "file": "img/st-act-warrant-d1.webp",
        "size": [
          1024,
          1536
        ]
      },
      "fallback": null,
      "rewards": "unchanged; original step(s) only",
      "interaction": "transfer",
      "transfer": {
        "item": null,
        "prop": {
          "en": "Warrant card",
          "vi": "Thẻ ngành"
        },
        "destination": {
          "en": "Ruth’s desk",
          "vi": "Bàn Ruth"
        },
        "art": null,
        "requiresOwnership": false
      },
      "target": {
        "x": 50,
        "y": 50,
        "radius": 20,
        "status": "candidate centre; inspect with final raster before enabling"
      },
      "overlays": [],
      "beforeAsset": null,
      "afterAsset": null,
      "approval": "candidate; feeling not reviewed",
      "activation": "reveal requires matched before/after pair; other modes require available image; otherwise original narration continues"
    }
  ]
};
